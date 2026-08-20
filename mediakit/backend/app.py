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
import hashlib
import io
import json
import os
import re
import secrets
import smtplib
import sqlite3
import ssl
import sys
import threading
import time
from email.message import EmailMessage
from email.utils import formataddr
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "mediakit.db")
ADMIN_KEY_PATH = os.path.join(BASE_DIR, "admin_key.txt")
PORT = 8787
MAX_BODY = 10_000  # bytes — signup payloads are tiny; reject anything else
MAX_SHARE_BODY = 40_000  # a saved kit is text-only (no images) but has many fields
EVENT_RETENTION_DAYS = 10  # usage logs self-purge — never grows unbounded on the VPS
EVENT_TYPES = {"pdf_download", "image_download", "share_created"}
SHARE_RETENTION_DAYS = 90  # shared links expire so the table can't grow forever
SHARE_ID_ALPHABET = "abcdefghijkmnopqrstuvwxyz23456789"  # no look-alikes (l/1, o/0)
SHARE_ID_LEN = 8
MAX_WHO_LEN = 300  # creator identity attached to a share_created activity entry
# Only used to expand a stored share id into a full link in the events CSV —
# the admin page builds the same URL from its own origin for the on-screen list.
SHARE_URL_BASE = "https://digihubhmax.com/media-kit.html?s="

# ---- email OTP login -------------------------------------------------------
# Off by default (config key `otp_login_enabled`). When on, an email address
# must be proved by a one-time code before a signup is accepted, and a
# returning visitor can restore their account on a new device the same way.
OTP_LEN = 6
OTP_TTL_SECONDS = 10 * 60        # a code stays usable for 10 minutes
OTP_MAX_ATTEMPTS = 5             # wrong guesses before the code is burned
OTP_MAX_PER_EMAIL = 3            # codes issuable per address per window below
OTP_EMAIL_WINDOW = 10 * 60
OTP_MAX_PER_IP = 12              # stops the endpoint being used as a mail relay
OTP_IP_WINDOW = 60 * 60
# Spent/expired codes are kept this long purely so the rate-limit counters
# above still have history to count -- an expired row can never be redeemed.
OTP_RETENTION = OTP_IP_WINDOW
SESSION_TTL_SECONDS = 90 * 86400  # a verified device stays signed in for 90 days
MAX_EMAIL_LEN = 160
MAX_PHONE_LEN = 40
SMTP_TIMEOUT = 15

# Per-IP write limits, as (max_requests, window_seconds). These sit in front of
# the endpoints that create rows, so a flood cannot bloat the database or fill
# the disk. Deliberately generous -- a real person trips none of them.
WRITE_LIMITS = {
    "signup": (10, 3600),   # a person signs up once; 10/hour covers retries
    "share": (20, 3600),    # making share links
    "event": (60, 3600),    # download/telemetry pings
}
RATE_BUCKET_CAP = 20000  # most tracked IPs before the oldest are evicted
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]{2,}$")


def now_iso():
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


def iso_at(epoch):
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(epoch))


def valid_email(value):
    return bool(EMAIL_RE.match(value or ""))


def valid_phone(value):
    return len(re.sub(r"\D", "", value or "")) >= 7


class RateLimiter:
    """Fixed-memory per-IP sliding window.

    Deliberately in-process rather than a table: these limits guard against
    floods, and writing a row per request to count requests would hand an
    attacker the very disk growth the limit exists to prevent. State resetting
    on restart is an acceptable trade for that.
    """

    def __init__(self, cap=RATE_BUCKET_CAP):
        self._hits = {}
        self._lock = threading.Lock()
        self._cap = cap

    def allow(self, bucket, ip, limit, window):
        if not ip:
            return True  # cannot attribute it; do not punish everyone
        now = time.time()
        key = (bucket, ip)
        with self._lock:
            stamps = [t for t in self._hits.get(key, ()) if t > now - window]
            if len(stamps) >= limit:
                self._hits[key] = stamps
                return False
            stamps.append(now)
            self._hits[key] = stamps
            if len(self._hits) > self._cap:
                self._evict(now)
            return True

    def _evict(self, now):
        """Drop entries whose newest hit is oldest. Called under the lock."""
        for key in sorted(self._hits, key=lambda k: self._hits[k][-1])[: self._cap // 4]:
            self._hits.pop(key, None)


RATE_LIMITER = RateLimiter()


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


def ensure_column(conn, table, column, decl):
    """Additive-only schema migration -- SQLite has no ADD COLUMN IF NOT EXISTS."""
    cols = {r["name"] for r in conn.execute("PRAGMA table_info(%s)" % table).fetchall()}
    if column not in cols:
        conn.execute("ALTER TABLE %s ADD COLUMN %s %s" % (table, column, decl))


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
    # Email and mobile used to be one combined `contact` field. They are two
    # columns now -- `contact` is kept (it is NOT NULL on existing installs)
    # and simply mirrors the email, which is the account identity.
    ensure_column(conn, "signups", "email", "TEXT")
    ensure_column(conn, "signups", "phone", "TEXT")
    ensure_column(conn, "signups", "email_verified", "INTEGER NOT NULL DEFAULT 0")
    # Split legacy rows by shape so the admin panel's two columns are populated
    # for people who signed up before the split.
    conn.execute(
        "UPDATE signups SET email = contact "
        "WHERE (email IS NULL OR email = '') AND contact LIKE '%@%'"
    )
    conn.execute(
        "UPDATE signups SET phone = contact "
        "WHERE (phone IS NULL OR phone = '') AND contact NOT LIKE '%@%'"
    )
    conn.execute("CREATE TABLE IF NOT EXISTS config (key TEXT PRIMARY KEY, value TEXT)")
    defaults = {
        "paid_enforce": "0",
        "adsense_enabled": "0",
        "adsense_publisher_id": "",
        "adsense_slot_id": "",
        "otp_login_enabled": "0",
        "smtp_host": "",
        "smtp_port": "587",
        "smtp_security": "starttls",
        "smtp_user": "",
        "smtp_pass": "",
        "smtp_from": "",
        "smtp_from_name": "DigiHub Media Kit",
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
    # Codes are stored hashed: a leaked DB file must not hand someone a live
    # login code for an address they do not control.
    conn.execute("""
        CREATE TABLE IF NOT EXISTS otp_codes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            code_hash TEXT NOT NULL,
            ip TEXT,
            created_at TEXT NOT NULL,
            expires_at TEXT NOT NULL,
            attempts INTEGER NOT NULL DEFAULT 0,
            consumed INTEGER NOT NULL DEFAULT 0
        )
    """)
    conn.execute("CREATE INDEX IF NOT EXISTS idx_otp_email ON otp_codes (email)")
    conn.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            token_hash TEXT PRIMARY KEY,
            email TEXT NOT NULL,
            created_at TEXT NOT NULL,
            expires_at TEXT NOT NULL
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


def event_export_fields(detail):
    """(who, share_url) pulled out of an event's detail blob for the CSV export.
    Detail is JSON: a bare string for download events, an object carrying who +
    share_id for share_created. Anything unparseable falls through as-is."""
    if not detail:
        return "", ""
    try:
        parsed = json.loads(detail)
    except Exception:
        return detail, ""
    if isinstance(parsed, dict):
        share_id = parsed.get("share_id") or ""
        return parsed.get("who") or "", (SHARE_URL_BASE + share_id if share_id else "")
    return str(parsed), ""


def all_events():
    conn = db()
    rows = conn.execute("SELECT * FROM events ORDER BY id DESC LIMIT 1000").fetchall()
    conn.close()
    return [dict(r) for r in rows]


CONFIG_KEYS = {
    "paid_enforce", "adsense_enabled", "adsense_publisher_id", "adsense_slot_id",
    "otp_login_enabled",
    "smtp_host", "smtp_port", "smtp_security", "smtp_user", "smtp_pass",
    "smtp_from", "smtp_from_name",
}
CONFIG_BOOL_KEYS = {"paid_enforce", "adsense_enabled", "otp_login_enabled"}
# /config is unauthenticated — only these ever leave the server on it.
PUBLIC_CONFIG_KEYS = {
    "paid_enforce", "adsense_enabled", "adsense_publisher_id", "adsense_slot_id",
    "otp_login_enabled",
}
# Never echoed back, not even to an authenticated admin page.
SECRET_CONFIG_KEYS = {"smtp_pass"}


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


def public_config():
    cfg = get_config()
    return {k: v for k, v in cfg.items() if k in PUBLIC_CONFIG_KEYS}


def admin_config_view():
    """Everything the admin page may see — the SMTP password is replaced by a
    boolean, so the page can show "set / not set" without ever holding it."""
    cfg = get_config()
    out = {k: v for k, v in cfg.items() if k not in SECRET_CONFIG_KEYS}
    out["smtp_pass_set"] = bool(cfg.get("smtp_pass"))
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


def insert_signup(name, email, phone, age, handle_main, handle_content, email_verified=False):
    conn = db()
    # One row per real person — the email is the account identity, so
    # re-submitting the gate (after clearing local storage, or on a second
    # device) updates that row instead of creating a duplicate.
    if email:
        existing = conn.execute(
            "SELECT * FROM signups WHERE lower(email) = lower(?)", (email,)
        ).fetchone()
    else:
        # A legacy phone-only submission has no email to key on.
        existing = conn.execute(
            "SELECT * FROM signups WHERE phone = ? AND (email IS NULL OR email = '')", (phone,)
        ).fetchone()
    if existing:
        # Only fill blanks — a later submission must not quietly overwrite
        # details the person entered the first time round.
        sets, params = [], []
        for column, value in (
            ("phone", phone), ("handle_main", handle_main),
            ("handle_content", handle_content), ("name", name),
        ):
            if value and not existing[column]:
                sets.append("%s = ?" % column)
                params.append(value)
        if age and not existing["age"]:
            sets.append("age = ?")
            params.append(age)
        if email_verified and not existing["email_verified"]:
            sets.append("email_verified = 1")
        if sets:
            params.append(existing["id"])
            conn.execute("UPDATE signups SET %s WHERE id = ?" % ", ".join(sets), params)
            conn.commit()
        conn.close()
        return
    conn.execute(
        "INSERT INTO signups (created_at, name, contact, email, phone, age, handle_main, handle_content, email_verified) "
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (now_iso(), name, email or phone, email, phone, age, handle_main, handle_content,
         1 if email_verified else 0),
    )
    conn.commit()
    conn.close()


def get_signup_by_email(email):
    conn = db()
    row = conn.execute(
        "SELECT * FROM signups WHERE lower(email) = lower(?)", (email,)
    ).fetchone()
    conn.close()
    return dict(row) if row else None


def mark_email_verified(email):
    conn = db()
    conn.execute("UPDATE signups SET email_verified = 1 WHERE lower(email) = lower(?)", (email,))
    conn.commit()
    conn.close()


def signup_public(row):
    """The subset of a signup row handed back to its own owner after they sign
    in, so the page can refill the builder on a device it never saw before."""
    if not row:
        return None
    return {
        "name": row.get("name") or "",
        "email": row.get("email") or "",
        "phone": row.get("phone") or "",
        "age": row.get("age"),
        "handle_main": row.get("handle_main") or "",
        "handle_content": row.get("handle_content") or "",
        "email_verified": bool(row.get("email_verified")),
    }


def all_signups():
    conn = db()
    rows = conn.execute("SELECT * FROM signups ORDER BY id DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]


# ===========================================================================
# Email one-time-code login
# ===========================================================================

def _code_hash(email, code):
    return hashlib.sha256(
        ("mk-otp:" + (email or "").lower() + ":" + (code or "")).encode("utf-8")
    ).hexdigest()


def _token_hash(token):
    return hashlib.sha256(("mk-session:" + (token or "")).encode("utf-8")).hexdigest()


def purge_auth():
    """Drop sessions that have lapsed and codes old enough that they no longer
    count towards a rate limit. Cheap at this scale, so it runs inline."""
    conn = db()
    conn.execute("DELETE FROM sessions WHERE expires_at < ?", (now_iso(),))
    conn.execute("DELETE FROM otp_codes WHERE created_at < ?", (iso_at(time.time() - OTP_RETENTION),))
    conn.commit()
    conn.close()


def create_otp(email, ip):
    """(code, None) on success, (None, message) when a rate limit says no."""
    purge_auth()
    conn = db()
    email_since = iso_at(time.time() - OTP_EMAIL_WINDOW)
    ip_since = iso_at(time.time() - OTP_IP_WINDOW)
    per_email = conn.execute(
        "SELECT COUNT(*) AS c FROM otp_codes WHERE lower(email) = lower(?) AND created_at > ?",
        (email, email_since),
    ).fetchone()["c"]
    if per_email >= OTP_MAX_PER_EMAIL:
        conn.close()
        return None, "Too many codes requested for this address. Wait 10 minutes, then try again."
    if ip:
        per_ip = conn.execute(
            "SELECT COUNT(*) AS c FROM otp_codes WHERE ip = ? AND created_at > ?",
            (ip, ip_since),
        ).fetchone()["c"]
        if per_ip >= OTP_MAX_PER_IP:
            conn.close()
            return None, "Too many requests from this network. Try again in a little while."
    code = "".join(secrets.choice("0123456789") for _ in range(OTP_LEN))
    # Retire anything still outstanding for this address, so the newest email is
    # always the one that works and there is no "which code was it?" moment.
    conn.execute(
        "UPDATE otp_codes SET consumed = 1 WHERE lower(email) = lower(?) AND consumed = 0",
        (email,),
    )
    conn.execute(
        "INSERT INTO otp_codes (email, code_hash, ip, created_at, expires_at, attempts, consumed) "
        "VALUES (?, ?, ?, ?, ?, 0, 0)",
        (email.lower(), _code_hash(email, code), ip or "", now_iso(),
         iso_at(time.time() + OTP_TTL_SECONDS)),
    )
    conn.commit()
    conn.close()
    return code, None


def verify_otp(email, code):
    """(True, None) when the code was right and is now spent; (False, message)
    otherwise. A code is single-use whatever the outcome of redeeming it."""
    conn = db()
    row = conn.execute(
        "SELECT * FROM otp_codes WHERE lower(email) = lower(?) AND consumed = 0 "
        "ORDER BY id DESC LIMIT 1",
        (email,),
    ).fetchone()
    if not row:
        conn.close()
        return False, "No code is waiting for that address. Request a new one."

    def burn(message):
        conn.execute("UPDATE otp_codes SET consumed = 1 WHERE id = ?", (row["id"],))
        conn.commit()
        conn.close()
        return False, message

    if row["expires_at"] < now_iso():
        return burn("That code has expired. Request a new one.")
    if row["attempts"] >= OTP_MAX_ATTEMPTS:
        return burn("Too many wrong attempts. Request a new code.")
    if not secrets.compare_digest(str(row["code_hash"]), _code_hash(email, code)):
        conn.execute("UPDATE otp_codes SET attempts = attempts + 1 WHERE id = ?", (row["id"],))
        conn.commit()
        remaining = OTP_MAX_ATTEMPTS - (row["attempts"] + 1)
        conn.close()
        if remaining <= 0:
            return False, "Too many wrong attempts. Request a new code."
        return False, "That code is not right. %d attempt%s left." % (
            remaining, "" if remaining == 1 else "s")
    conn.execute("UPDATE otp_codes SET consumed = 1 WHERE id = ?", (row["id"],))
    conn.commit()
    conn.close()
    return True, None


def create_session(email):
    token = secrets.token_urlsafe(32)
    conn = db()
    conn.execute(
        "INSERT INTO sessions (token_hash, email, created_at, expires_at) VALUES (?, ?, ?, ?)",
        (_token_hash(token), email.lower(), now_iso(), iso_at(time.time() + SESSION_TTL_SECONDS)),
    )
    conn.commit()
    conn.close()
    return token


def session_email(token):
    """The verified address behind a session token, or None."""
    if not token:
        return None
    conn = db()
    row = conn.execute(
        "SELECT email, expires_at FROM sessions WHERE token_hash = ?", (_token_hash(token),)
    ).fetchone()
    conn.close()
    if not row or row["expires_at"] < now_iso():
        return None
    return row["email"]


def drop_session(token):
    if not token:
        return
    conn = db()
    conn.execute("DELETE FROM sessions WHERE token_hash = ?", (_token_hash(token),))
    conn.commit()
    conn.close()


def send_email(to_addr, subject, body_text):
    """(True, None) or (False, reason). Never raises — a mail failure has to
    surface as a message the caller can show, not as a 500."""
    cfg = get_config()
    host = (cfg.get("smtp_host") or "").strip()
    if not host:
        return False, "Email sending is not configured yet."
    try:
        port = int(cfg.get("smtp_port") or 587)
    except (TypeError, ValueError):
        port = 587
    security = (cfg.get("smtp_security") or "starttls").strip().lower()
    user = (cfg.get("smtp_user") or "").strip()
    password = cfg.get("smtp_pass") or ""
    from_addr = (cfg.get("smtp_from") or "").strip() or user
    from_name = (cfg.get("smtp_from_name") or "").strip() or "Media Kit"
    if not from_addr:
        return False, "No sender address is configured."

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = formataddr((from_name, from_addr))
    msg["To"] = to_addr
    msg.set_content(body_text)
    try:
        if security == "ssl":
            server = smtplib.SMTP_SSL(host, port, timeout=SMTP_TIMEOUT,
                                      context=ssl.create_default_context())
        else:
            server = smtplib.SMTP(host, port, timeout=SMTP_TIMEOUT)
        with server:
            if security == "starttls":
                server.starttls(context=ssl.create_default_context())
            if user:
                server.login(user, password)
            server.send_message(msg)
    except Exception as exc:
        # Full detail to the log for us, a short class name to the visitor.
        sys.stderr.write("smtp send failed: %r\n" % (exc,))
        return False, "Could not send the email (%s). Check the SMTP settings." % exc.__class__.__name__
    return True, None


def send_otp_email(to_addr, code):
    minutes = OTP_TTL_SECONDS // 60
    body = (
        "Your Media Kit Builder verification code is:\n\n"
        "    %s\n\n"
        "It expires in %d minutes and can only be used once.\n\n"
        "If you did not ask for this code you can ignore this email — "
        "nobody can sign in without it.\n"
    ) % (code, minutes)
    return send_email(to_addr, "Your Media Kit code: %s" % code, body)


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

    def _session_email(self):
        return session_email(self.headers.get("X-Session-Token", ""))

    def _rate_ok(self, bucket):
        """False (and the 429 already sent) when this caller is over the limit."""
        limit, window = WRITE_LIMITS[bucket]
        if RATE_LIMITER.allow(bucket, self._client_ip(), limit, window):
            return True
        self._send_json(429, {"error": "Too many requests. Try again later."})
        return False

    def _client_ip(self):
        """Everything arrives from nginx on 127.0.0.1, so a proxy header is the
        only thing that tells callers apart.

        Order is CF-Connecting-IP, then X-Real-IP, then the socket.

        Never X-Forwarded-For: our nginx does not set it, so it arrives exactly
        as the caller wrote it and anyone could land in a fresh bucket every
        request. X-Real-IP nginx does set, from $remote_addr, overwriting what
        the caller sent -- but behind Cloudflare that is an edge IP, not the
        visitor. CF-Connecting-IP is set by Cloudflare and is the real one.

        A caller who reaches the origin directly, bypassing Cloudflare, could
        still spoof CF-Connecting-IP. That only evades a rate limit, never an
        auth decision. The robust fix is nginx `set_real_ip_from <cloudflare
        ranges>` + `real_ip_header CF-Connecting-IP`, which makes $remote_addr
        itself the true client IP and cannot be forged -- see
        deploy/nginx-admin-auth.snippet.conf.
        """
        # The site sits behind Cloudflare, so nginx's $remote_addr -- and
        # therefore the X-Real-IP it derives from it -- is a Cloudflare edge
        # address that varies between requests. Bucketing on it silently
        # defeats the limit. CF-Connecting-IP is the actual visitor.
        cf = self.headers.get("CF-Connecting-IP", "").strip()
        if cf:
            return cf[:64]
        real = self.headers.get("X-Real-IP", "").strip()
        if real:
            return real[:64]
        # Direct connection (local testing, or nginx misconfigured).
        return self.client_address[0] if self.client_address else ""

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
            # Unauthenticated: SMTP credentials must never appear here.
            self._send_json(200, public_config())
        elif self.path == "/auth/me":
            email = self._session_email()
            if not email:
                self._send_json(401, {"error": "not signed in"})
                return
            self._send_json(200, {"email": email, "signup": signup_public(get_signup_by_email(email))})
        elif self.path == "/admin/config":
            if not self._is_admin():
                self._send_json(401, {"error": "unauthorized"})
                return
            self._send_json(200, admin_config_view())
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
            writer.writerow(["id", "created_at", "name", "email", "phone", "age",
                             "handle_main", "handle_content", "email_verified"])
            for r in rows:
                writer.writerow([r["id"], r["created_at"], r["name"], r.get("email") or "",
                                 r.get("phone") or "", r["age"], r["handle_main"],
                                 r["handle_content"], "yes" if r.get("email_verified") else "no"])
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
            writer.writerow(["id", "created_at", "event_type", "who", "share_url", "detail"])
            for r in rows:
                who, share_url = event_export_fields(r["detail"])
                writer.writerow([r["id"], r["created_at"], r["event_type"], who, share_url, r["detail"]])
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
            if not self._rate_ok("signup"):
                return
            data = self._read_json()
            if not data:
                self._send_json(400, {"error": "invalid body"})
                return
            name = str(data.get("name", "")).strip()[:120]
            email = str(data.get("email", "")).strip()[:MAX_EMAIL_LEN]
            phone = str(data.get("phone", "")).strip()[:MAX_PHONE_LEN]
            # A page cached from before email and mobile were split posts a
            # single `contact` and has no mobile field at all, so it could never
            # satisfy the both-required rule below. Recognise those submissions
            # by shape, split the one value we got, and let them through with
            # half the pair rather than dead-ending a real person on a stale tab.
            legacy_payload = "email" not in data and "phone" not in data and "contact" in data
            if legacy_payload:
                legacy = str(data.get("contact", "")).strip()[:MAX_EMAIL_LEN]
                if "@" in legacy:
                    email = legacy
                else:
                    phone = legacy[:MAX_PHONE_LEN]
            handle_main = str(data.get("handle_main", "")).strip().lstrip("@")[:60]
            handle_content = str(data.get("handle_content", "")).strip().lstrip("@")[:60]
            age_raw = data.get("age")
            try:
                age = int(age_raw)
            except (TypeError, ValueError):
                age = None

            if legacy_payload:
                if not name or not handle_main or not (email or phone):
                    self._send_json(400, {"error": "name, contact and handle_main are required"})
                    return
            elif not name or not email or not phone or not handle_main:
                self._send_json(400, {"error": "name, email, mobile and handle_main are required"})
                return
            if email and not valid_email(email):
                self._send_json(400, {"error": "that email address doesn't look right"})
                return
            if phone and not valid_phone(phone):
                self._send_json(400, {"error": "that mobile number doesn't look right"})
                return
            if age is not None and (age < 5 or age > 120):
                self._send_json(400, {"error": "age looks invalid"})
                return

            # With OTP login on, an address only enters the database once its
            # owner has proved it by redeeming a code.
            verified = False
            if email and get_config().get("otp_login_enabled") and not legacy_payload:
                proved = self._session_email()
                if not proved or proved.lower() != email.lower():
                    self._send_json(401, {"error": "verify your email first", "code": "otp_required"})
                    return
                verified = True

            insert_signup(name, email, phone, age, handle_main, handle_content or None,
                          email_verified=verified)
            self._send_json(200, {
                "ok": True,
                "signup": signup_public(get_signup_by_email(email)) if email else None,
            })
        elif self.path == "/auth/request-otp":
            data = self._read_json()
            if not isinstance(data, dict):
                self._send_json(400, {"error": "invalid body"})
                return
            if not get_config().get("otp_login_enabled"):
                self._send_json(403, {"error": "email login is turned off"})
                return
            email = str(data.get("email", "")).strip()[:MAX_EMAIL_LEN]
            if not valid_email(email):
                self._send_json(400, {"error": "that email address doesn't look right"})
                return
            code, err = create_otp(email, self._client_ip())
            if err:
                self._send_json(429, {"error": err})
                return
            sent, mail_err = send_otp_email(email, code)
            if not sent:
                self._send_json(502, {"error": mail_err})
                return
            self._send_json(200, {
                "ok": True,
                "expires_in": OTP_TTL_SECONDS,
                # Lets the page say "welcome back" instead of asking a returning
                # visitor to fill the whole signup form again.
                "registered": bool(get_signup_by_email(email)),
            })
        elif self.path == "/auth/verify-otp":
            data = self._read_json()
            if not isinstance(data, dict):
                self._send_json(400, {"error": "invalid body"})
                return
            if not get_config().get("otp_login_enabled"):
                self._send_json(403, {"error": "email login is turned off"})
                return
            email = str(data.get("email", "")).strip()[:MAX_EMAIL_LEN]
            code = re.sub(r"\D", "", str(data.get("code", "")))[:OTP_LEN]
            if not valid_email(email) or len(code) != OTP_LEN:
                self._send_json(400, {"error": "enter the %d-digit code from your email" % OTP_LEN})
                return
            ok, err = verify_otp(email, code)
            if not ok:
                self._send_json(400, {"error": err})
                return
            # Redeeming a code is also the moment a pre-existing signup for that
            # address becomes a confirmed one.
            mark_email_verified(email)
            self._send_json(200, {
                "token": create_session(email),
                "email": email,
                "expires_in": SESSION_TTL_SECONDS,
                "signup": signup_public(get_signup_by_email(email)),
            })
        elif self.path == "/auth/logout":
            drop_session(self.headers.get("X-Session-Token", ""))
            self._send_json(200, {"ok": True})
        elif self.path == "/share":
            if not self._rate_ok("share"):
                return
            data = self._read_json(MAX_SHARE_BODY)
            if not isinstance(data, dict):
                self._send_json(400, {"error": "invalid body"})
                return
            # Images are never accepted here — they stay on the creator's
            # device, and they're what made the old inline links enormous.
            data.pop("photo", None)
            data.pop("bgImage", None)
            # Creator identity for the activity log — popped so it never
            # becomes part of the saved kit that the link hands to viewers.
            who = str(data.pop("_who", "") or "").strip()[:MAX_WHO_LEN]
            try:
                share_id = insert_share(json.dumps(data))
            except Exception:
                self._send_json(500, {"error": "could not save"})
                return
            # Logged server-side rather than by the client so a link can never
            # exist without an activity row for it. Never let a logging failure
            # cost the caller the link it just created.
            try:
                insert_event("share_created", json.dumps({"who": who, "share_id": share_id}))
            except Exception:
                pass
            self._send_json(200, {"id": share_id, "expires_days": SHARE_RETENTION_DAYS})
        elif self.path == "/event":
            if not self._rate_ok("event"):
                return
            data = self._read_json()
            if not data:
                self._send_json(400, {"error": "invalid body"})
                return
            event_type = str(data.get("type", "")).strip()
            if event_type not in EVENT_TYPES:
                self._send_json(400, {"error": "unknown event type"})
                return
            detail = data.get("detail")
            # Truncate the value, not the JSON — slicing the encoded form could
            # cut mid-string and leave the admin page an unparseable blob.
            if isinstance(detail, str):
                detail = detail[:MAX_WHO_LEN]
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
            # The admin page never receives the stored password, so it posts an
            # empty box back — that means "leave it alone", not "clear it".
            if "smtp_pass" in data and not str(data.get("smtp_pass") or "").strip():
                data.pop("smtp_pass")
            update_config(data)
            self._send_json(200, admin_config_view())
        elif self.path == "/admin/test-email":
            if not self._is_admin():
                self._send_json(401, {"error": "unauthorized"})
                return
            data = self._read_json()
            to_addr = str((data or {}).get("to", "")).strip()[:MAX_EMAIL_LEN]
            if not valid_email(to_addr):
                self._send_json(400, {"error": "enter a valid address to send the test to"})
                return
            sent, err = send_email(
                to_addr,
                "Media Kit SMTP test",
                "This is a test message from the Media Kit admin panel.\n\n"
                "If you are reading it, login codes will reach your visitors.\n",
            )
            if not sent:
                self._send_json(502, {"error": err})
                return
            self._send_json(200, {"ok": True})
        else:
            self._send_json(404, {"error": "not found"})


if __name__ == "__main__":
    init_db()
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print("mediakit-api listening on 127.0.0.1:%d" % PORT)
    server.serve_forever()
