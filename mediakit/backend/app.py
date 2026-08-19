#!/usr/bin/env python3
"""Media Kit Builder — signup + admin backend.

Stdlib-only on purpose: runs as the unprivileged `digihub` user with no pip
installs, no root, no systemd — started via nohup (see deploy notes) and
re-started on reboot via a per-user crontab @reboot entry. SQLite is a
single file next to this script; nginx reverse-proxies
digihubhmax.com/api/mediakit/ to 127.0.0.1:8787 (that nginx edit is the one
piece that needs a human with root, done once).
"""
import csv
import io
import json
import os
import secrets
import sqlite3
import sys
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "mediakit.db")
ADMIN_KEY_PATH = os.path.join(BASE_DIR, "admin_key.txt")
PORT = 8787
MAX_BODY = 10_000  # bytes — signup payloads are tiny; reject anything else
MAX_SHARE_BODY = 40_000  # a saved kit is text-only (no images) but has many fields
EVENT_RETENTION_DAYS = 10  # usage logs self-purge — never grows unbounded on the VPS
EVENT_TYPES = {"pdf_download", "image_download"}
SHARE_RETENTION_DAYS = 90  # shared links expire so the table can't grow forever
SHARE_ID_ALPHABET = "abcdefghijkmnopqrstuvwxyz23456789"  # no look-alikes (l/1, o/0)
SHARE_ID_LEN = 8


def get_admin_key():
    if not os.path.exists(ADMIN_KEY_PATH):
        key = secrets.token_urlsafe(24)
        with open(ADMIN_KEY_PATH, "w") as f:
            f.write(key)
        os.chmod(ADMIN_KEY_PATH, 0o600)
        return key
    with open(ADMIN_KEY_PATH) as f:
        return f.read().strip()


ADMIN_KEY = get_admin_key()


def db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS signups (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at TEXT NOT NULL,
            name TEXT NOT NULL,
            contact TEXT NOT NULL,
            age INTEGER,
            handle_main TEXT NOT NULL,
            handle_content TEXT
        )
    """)
    conn.execute("CREATE TABLE IF NOT EXISTS config (key TEXT PRIMARY KEY, value TEXT)")
    defaults = {
        "paid_enforce": "0",
        "adsense_enabled": "0",
        "adsense_publisher_id": "",
        "adsense_slot_id": "",
    }
    for k, v in defaults.items():
        conn.execute("INSERT OR IGNORE INTO config (key, value) VALUES (?, ?)", (k, v))
    conn.execute("""
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at TEXT NOT NULL,
            event_type TEXT NOT NULL,
            detail TEXT
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS shares (
            id TEXT PRIMARY KEY,
            created_at TEXT NOT NULL,
            payload TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()


def purge_old_shares():
    cutoff = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(time.time() - SHARE_RETENTION_DAYS * 86400))
    conn = db()
    conn.execute("DELETE FROM shares WHERE created_at < ?", (cutoff,))
    conn.commit()
    conn.close()


def new_share_id(conn):
    for _ in range(12):
        candidate = "".join(secrets.choice(SHARE_ID_ALPHABET) for _ in range(SHARE_ID_LEN))
        if not conn.execute("SELECT 1 FROM shares WHERE id = ?", (candidate,)).fetchone():
            return candidate
    raise RuntimeError("could not allocate a share id")


def insert_share(payload_text):
    purge_old_shares()  # cheap at this scale; keeps the table bounded without a cron
    conn = db()
    share_id = new_share_id(conn)
    conn.execute(
        "INSERT INTO shares (id, created_at, payload) VALUES (?, ?, ?)",
        (share_id, time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), payload_text),
    )
    conn.commit()
    conn.close()
    return share_id


def get_share(share_id):
    conn = db()
    row = conn.execute("SELECT payload FROM shares WHERE id = ?", (share_id,)).fetchone()
    conn.close()
    return row["payload"] if row else None


def purge_old_events():
    cutoff = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(time.time() - EVENT_RETENTION_DAYS * 86400))
    conn = db()
    conn.execute("DELETE FROM events WHERE created_at < ?", (cutoff,))
    conn.commit()
    conn.close()


def insert_event(event_type, detail):
    purge_old_events()  # cheap at this scale — keeps storage bounded with no separate cron process
    conn = db()
    conn.execute(
        "INSERT INTO events (created_at, event_type, detail) VALUES (?, ?, ?)",
        (time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), event_type, detail),
    )
    conn.commit()
    conn.close()


def all_events():
    conn = db()
    rows = conn.execute("SELECT * FROM events ORDER BY id DESC LIMIT 1000").fetchall()
    conn.close()
    return [dict(r) for r in rows]


CONFIG_KEYS = {"paid_enforce", "adsense_enabled", "adsense_publisher_id", "adsense_slot_id"}
CONFIG_BOOL_KEYS = {"paid_enforce", "adsense_enabled"}


def get_config():
    conn = db()
    rows = conn.execute("SELECT key, value FROM config").fetchall()
    conn.close()
    out = {}
    for r in rows:
        if r["key"] in CONFIG_BOOL_KEYS:
            out[r["key"]] = r["value"] == "1"
        else:
            out[r["key"]] = r["value"]
    return out


def update_config(patch):
    conn = db()
    for key, value in patch.items():
        if key not in CONFIG_KEYS:
            continue
        stored = ("1" if value else "0") if key in CONFIG_BOOL_KEYS else str(value)[:200]
        conn.execute(
            "INSERT INTO config (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
            (key, stored),
        )
    conn.commit()
    conn.close()


def insert_signup(name, contact, age, handle_main, handle_content):
    conn = db()
    # One row per real person — same contact (their account identity) never
    # creates a second log entry, e.g. after clearing local storage and
    # re-submitting the signup gate.
    existing = conn.execute(
        "SELECT id FROM signups WHERE lower(contact) = lower(?)", (contact,)
    ).fetchone()
    if existing:
        conn.close()
        return
    conn.execute(
        "INSERT INTO signups (created_at, name, contact, age, handle_main, handle_content) "
        "VALUES (?, ?, ?, ?, ?, ?)",
        (time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), name, contact, age, handle_main, handle_content),
    )
    conn.commit()
    conn.close()


def all_signups():
    conn = db()
    rows = conn.execute("SELECT * FROM signups ORDER BY id DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]


class Handler(BaseHTTPRequestHandler):
    server_version = "MediaKitAPI/1.0"

    def log_message(self, fmt, *args):
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))

    def _send_json(self, status, obj):
        body = json.dumps(obj).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _read_json(self, max_bytes=MAX_BODY):
        length = int(self.headers.get("Content-Length", 0))
        if length <= 0 or length > max_bytes:
            return None
        raw = self.rfile.read(length)
        try:
            return json.loads(raw)
        except Exception:
            return None

    def _is_admin(self):
        return secrets.compare_digest(self.headers.get("X-Admin-Key", ""), ADMIN_KEY)

    def do_GET(self):
        if self.path.startswith("/share/"):
            share_id = self.path[len("/share/"):].strip("/")
            if not share_id or len(share_id) > 64:
                self._send_json(400, {"error": "bad id"})
                return
            payload = get_share(share_id)
            if payload is None:
                self._send_json(404, {"error": "not found or expired"})
                return
            body = payload.encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        elif self.path == "/config":
            self._send_json(200, get_config())
        elif self.path == "/admin/signups":
            if not self._is_admin():
                self._send_json(401, {"error": "unauthorized"})
                return
            self._send_json(200, {"signups": all_signups()})
        elif self.path == "/admin/signups.csv":
            if not self._is_admin():
                self._send_json(401, {"error": "unauthorized"})
                return
            rows = all_signups()
            buf = io.StringIO()
            writer = csv.writer(buf)
            writer.writerow(["id", "created_at", "name", "contact", "age", "handle_main", "handle_content"])
            for r in rows:
                writer.writerow([r["id"], r["created_at"], r["name"], r["contact"], r["age"], r["handle_main"], r["handle_content"]])
            body = buf.getvalue().encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/csv; charset=utf-8")
            self.send_header("Content-Disposition", 'attachment; filename="mediakit-signups.csv"')
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        elif self.path == "/admin/events":
            if not self._is_admin():
                self._send_json(401, {"error": "unauthorized"})
                return
            purge_old_events()
            self._send_json(200, {"events": all_events(), "retention_days": EVENT_RETENTION_DAYS})
        elif self.path == "/admin/events.csv":
            if not self._is_admin():
                self._send_json(401, {"error": "unauthorized"})
                return
            purge_old_events()
            rows = all_events()
            buf = io.StringIO()
            writer = csv.writer(buf)
            writer.writerow(["id", "created_at", "event_type", "detail"])
            for r in rows:
                writer.writerow([r["id"], r["created_at"], r["event_type"], r["detail"]])
            body = buf.getvalue().encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/csv; charset=utf-8")
            self.send_header("Content-Disposition", 'attachment; filename="mediakit-events.csv"')
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        else:
            self._send_json(404, {"error": "not found"})

    def do_POST(self):
        if self.path == "/signup":
            data = self._read_json()
            if not data:
                self._send_json(400, {"error": "invalid body"})
                return
            name = str(data.get("name", "")).strip()[:120]
            contact = str(data.get("contact", "")).strip()[:120]
            handle_main = str(data.get("handle_main", "")).strip().lstrip("@")[:60]
            handle_content = str(data.get("handle_content", "")).strip().lstrip("@")[:60]
            age_raw = data.get("age")
            try:
                age = int(age_raw)
            except (TypeError, ValueError):
                age = None

            if not name or not contact or not handle_main:
                self._send_json(400, {"error": "name, contact and handle_main are required"})
                return
            if age is not None and (age < 5 or age > 120):
                self._send_json(400, {"error": "age looks invalid"})
                return

            insert_signup(name, contact, age, handle_main, handle_content or None)
            self._send_json(200, {"ok": True})
        elif self.path == "/share":
            data = self._read_json(MAX_SHARE_BODY)
            if not isinstance(data, dict):
                self._send_json(400, {"error": "invalid body"})
                return
            # Images are never accepted here — they stay on the creator's
            # device, and they're what made the old inline links enormous.
            data.pop("photo", None)
            data.pop("bgImage", None)
            try:
                share_id = insert_share(json.dumps(data))
            except Exception:
                self._send_json(500, {"error": "could not save"})
                return
            self._send_json(200, {"id": share_id, "expires_days": SHARE_RETENTION_DAYS})
        elif self.path == "/event":
            data = self._read_json()
            if not data:
                self._send_json(400, {"error": "invalid body"})
                return
            event_type = str(data.get("type", "")).strip()
            if event_type not in EVENT_TYPES:
                self._send_json(400, {"error": "unknown event type"})
                return
            detail = data.get("detail")
            detail_str = json.dumps(detail)[:500] if detail is not None else None
            insert_event(event_type, detail_str)
            self._send_json(200, {"ok": True})
        elif self.path == "/admin/config":
            if not self._is_admin():
                self._send_json(401, {"error": "unauthorized"})
                return
            data = self._read_json()
            if not data or not any(k in CONFIG_KEYS for k in data):
                self._send_json(400, {"error": "invalid body"})
                return
            update_config(data)
            self._send_json(200, get_config())
        else:
            self._send_json(404, {"error": "not found"})


if __name__ == "__main__":
    init_db()
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print("mediakit-api listening on 127.0.0.1:%d" % PORT)
    server.serve_forever()
