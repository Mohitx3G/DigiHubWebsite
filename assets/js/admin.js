/* ============================================================
   admin.js — DiGiHub admin panel.
   Edits a DRAFT copy of the site content (kept in localStorage),
   previews it live on the real pages, and exports/publishes the
   final config.js.

   NOTE on security: this is a static site, so this login protects
   the ADMIN UI only. Real protection comes from the publish step —
   nobody can change the live site without your hosting/GitHub
   access. Never commit a GitHub token into the repo.
   ============================================================ */

/* ---------- admin account (password stored as SHA-256 hash) ---------- */
const ADMIN = {
  username: "mohitrp4412",
  email: "mohitrp4412@gmail.com",
  // SHA-256 of "username:password" — regenerate with:
  // node -e "console.log(require('crypto').createHash('sha256').update('user:pass').digest('hex'))"
  passHash: "3c1966b7a5562888d057a142408df5eda89a96dc1423cf351ab14dba174be366",
};

const DRAFT_KEY = "digihub_draft_v1";
const SESSION_KEY = "digihub_admin_session";
const GH_KEY = "digihub_gh_settings";

/* ---------- helpers ---------- */
const $ = (sel) => document.querySelector(sel);
const clone = (o) => JSON.parse(JSON.stringify(o));
const stripPrivate = (k, v) => (typeof k === "string" && k.startsWith("_") ? undefined : v);

async function sha256(str) {
  if (!(window.crypto && crypto.subtle)) {
    throw new Error("This browser context can't hash passwords. Open the site via http://localhost or https://, not a plain IP.");
  }
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

let toastTimer;
function toast(msg, ms = 2600) {
  const t = $("#toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, ms);
}

/* ---------- state ---------- */
let data;            // { site, projects, legal } — the draft being edited
let dirty = false;
let currentTab = "site";
let editingProject = -1;   // index into data.projects, -1 = list view
let editingLegal = -1;
let editingGuide = -1;

function markDirty() {
  dirty = true;
  $("#btn-save").textContent = "💾 Save draft •";
}
function loadData() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
      const d = JSON.parse(raw);
      // Drafts saved before Guides existed won't have d.guides — fall back
      // to the static list rather than losing the guides tab entirely.
      if (d && d.site && d.projects && d.legal) return { ...d, guides: d.guides || clone(GUIDES) };
    }
  } catch (e) { /* fall through */ }
  return { site: clone(SITE), projects: clone(PROJECTS), legal: clone(LEGAL), guides: clone(GUIDES) };
}
function saveDraft() {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(data, stripPrivate));
  dirty = false;
  $("#btn-save").textContent = "💾 Save draft";
  toast("Draft saved ✓ — click “Preview site” to see it. Publish when happy.");
}

/* ---------- generic form builders ---------- */
function fld(label, obj, key, opts = {}) {
  const wrap = document.createElement("label");
  wrap.className = "f-field" + (opts.full ? " full" : "");
  wrap.append(label);

  let input;
  if (opts.type === "textarea") {
    input = document.createElement("textarea");
    if (opts.rows) input.rows = opts.rows;
  } else if (opts.type === "select") {
    input = document.createElement("select");
    (opts.options || []).forEach((o) => {
      const op = document.createElement("option");
      op.value = o; op.textContent = o;
      input.appendChild(op);
    });
  } else {
    input = document.createElement("input");
    input.type = "text";
  }
  if (opts.placeholder) input.placeholder = opts.placeholder;

  const val = opts.get ? opts.get(obj) : obj[key];
  input.value = val == null ? "" : val;

  input.addEventListener("input", () => {
    if (opts.set) opts.set(obj, input.value);
    else obj[key] = opts.number ? (parseInt(input.value, 10) || 0) : input.value;
    markDirty();
  });

  wrap.appendChild(input);
  return wrap;
}

function card(title) {
  const c = document.createElement("div");
  c.className = "a-card";
  if (title) {
    const h = document.createElement("h3");
    h.textContent = title;
    c.appendChild(h);
  }
  return c;
}

function grid(...fields) {
  const g = document.createElement("div");
  g.className = "f-grid";
  fields.forEach((f) => g.appendChild(f));
  return g;
}

/* List editor: rows of fields with add / remove / reorder. */
function listEditor(host, arr, makeFields, blank, addLabel) {
  function render() {
    host.innerHTML = "";
    arr.forEach((item, i) => {
      const row = document.createElement("div");
      row.className = "li-row";

      const fields = document.createElement("div");
      fields.className = "li-fields";
      makeFields(item).forEach((f) => fields.appendChild(f));

      const ctl = document.createElement("div");
      ctl.className = "li-ctl";
      const mk = (txt, cls, fn) => {
        const b = document.createElement("button");
        b.type = "button"; b.textContent = txt; if (cls) b.className = cls;
        b.addEventListener("click", fn);
        ctl.appendChild(b);
      };
      mk("↑", "", () => { if (i > 0) { [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]; markDirty(); render(); } });
      mk("↓", "", () => { if (i < arr.length - 1) { [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]]; markDirty(); render(); } });
      mk("✕", "del", () => { if (confirm("Remove this item?")) { arr.splice(i, 1); markDirty(); render(); } });

      row.append(fields, ctl);
      host.appendChild(row);
    });

    const add = document.createElement("button");
    add.type = "button";
    add.className = "li-add";
    add.textContent = addLabel || "+ Add item";
    add.addEventListener("click", () => { arr.push(clone(blank)); markDirty(); render(); });
    host.appendChild(add);
  }
  render();
}

/* Chat mockup editor (used for hero + each project). */
function chatEditor(host, owner) {
  owner.chat = owner.chat || { avatar: "🤖", botName: "", messages: [] };
  const c = owner.chat;
  host.appendChild(grid(
    fld("Avatar (emoji or <img src='...'/>)", c, "avatar"),
    fld("Bot name shown in header", c, "botName"),
  ));
  const list = document.createElement("div");
  list.style.marginTop = "14px";
  host.appendChild(list);
  listEditor(list, c.messages, (m) => [
    fld("From", m, "side", { type: "select", options: ["in", "out"] }),
    fld("Time (e.g. 14:02)", m, "time"),
    fld("Message (simple HTML allowed: <b>, <br>, spans)", m, "html", { type: "textarea", rows: 2, full: true }),
    fld("Inline buttons (comma separated, optional)", m, "buttons", {
      full: true,
      get: (o) => (o.buttons || []).join(", "),
      set: (o, v) => { o.buttons = v.split(",").map((s) => s.trim()).filter(Boolean); },
    }),
  ], { side: "in", html: "", time: "" }, "+ Add chat message");
}

/* Legal body <-> plain text (blank line = new paragraph, "- " = bullet) */
function bodyToText(body) {
  return (body || []).map((it) =>
    it && it.list ? it.list.map((l) => "- " + l).join("\n") : it
  ).join("\n\n");
}
function textToBody(text) {
  const blocks = [];
  let list = null;
  String(text).split("\n").forEach((lineRaw) => {
    const line = lineRaw.trim();
    if (!line) { list = null; return; }
    if (line.startsWith("- ")) {
      if (!list) { list = { list: [] }; blocks.push(list); }
      list.list.push(line.slice(2));
    } else {
      list = null;
      blocks.push(line);
    }
  });
  return blocks;
}

/* ============================================================
   TAB: SITE
   ============================================================ */
function renderSiteTab(host) {
  host.innerHTML = `<h2>Site settings</h2>
    <p class="hint">Brand, links, homepage hero and the "How we build" cards. Save the draft, preview, then publish.</p>`;

  const s = data.site;

  const brand = card("Brand & links");
  brand.appendChild(grid(
    fld("Brand name", s, "brand"),
    fld("Tagline", s, "tagline"),
    fld("Logo path (empty = 🤖 emoji)", s, "logo"),
    fld("Copyright year", s, "year", { number: true }),
    fld("Main Telegram link", s, "telegram"),
    fld("Support / channel link", s, "supportChannel"),
    fld("Contact email (footer + legal pages)", s, "email"),
  ));
  host.appendChild(brand);

  const hero = card("Homepage hero");
  hero.appendChild(grid(
    fld("Eyebrow (small text above title)", s.hero, "eyebrow"),
    fld("Primary button label", s.hero.primaryBtn, "label"),
    fld("Title (HTML allowed — <span class='hl'>…</span> = blue highlight)", s.hero, "title", { type: "textarea", rows: 2, full: true }),
    fld("Lead paragraph", s.hero, "lead", { type: "textarea", rows: 3, full: true }),
    fld("Primary button link", s.hero.primaryBtn, "href"),
    fld("Ghost button label", s.hero.ghostBtn, "label"),
    fld("Ghost button link", s.hero.ghostBtn, "href"),
  ));
  host.appendChild(hero);

  const chat = card("Homepage chat mockup (the phone)");
  chatEditor(chat, s.hero);
  host.appendChild(chat);

  const hl = card('"How we build" cards');
  const hlList = document.createElement("div");
  hl.appendChild(hlList);
  s.highlights = s.highlights || [];
  listEditor(hlList, s.highlights, (f) => [
    fld("Icon (emoji)", f, "icon"),
    fld("Title", f, "title"),
    fld("Description", f, "desc", { type: "textarea", rows: 2, full: true }),
  ], { icon: "✨", title: "", desc: "" }, "+ Add card");
  host.appendChild(hl);
}

/* ============================================================
   TAB: PROJECTS (bots)
   ============================================================ */
function detailsTemplate(p) {
  return {
    botUsername: "@YourBot",
    botLink: "https://t.me/YourBot",
    eyebrow: `// ${p.name || "New bot"} · live`,
    headline: "",
    sub: "",
    ctaLabel: "Open in Telegram",
    chat: { avatar: p.emoji || "🤖", botName: p.name || "", messages: [] },
    features: [],
    steps: [],
    tiers: [],
    faq: [],
    cta: { title: "", text: "", btnLabel: "Open in Telegram" },
  };
}

function renderProjectsTab(host) {
  if (editingProject >= 0) return renderProjectEditor(host, editingProject);

  host.innerHTML = `<h2>Bots / Projects</h2>
    <p class="hint">Each entry is a card on the homepage. Give it a detail page and it also gets its own page + nav link automatically.</p>`;

  const list = document.createElement("div");
  list.className = "obj-list";
  data.projects.forEach((p, i) => {
    const item = document.createElement("div");
    item.className = "obj-item";
    item.innerHTML = `
      <span class="emoji">${p.emoji || "🤖"}</span>
      <span class="obj-name">${p.name || "(unnamed)"}
        <small>${p.status}${p.details ? " · has detail page" : " · card only"}</small>
      </span>`;
    const mk = (txt, cls, fn) => {
      const b = document.createElement("button");
      b.className = "btn " + cls; b.textContent = txt;
      b.addEventListener("click", fn);
      item.appendChild(b);
    };
    mk("↑", "btn-ghost", () => { if (i > 0) { [data.projects[i - 1], data.projects[i]] = [data.projects[i], data.projects[i - 1]]; markDirty(); renderTab(); } });
    mk("↓", "btn-ghost", () => { if (i < data.projects.length - 1) { [data.projects[i + 1], data.projects[i]] = [data.projects[i], data.projects[i + 1]]; markDirty(); renderTab(); } });
    mk("Edit", "btn-gold", () => { editingProject = i; renderTab(); });
    mk("Delete", "btn-ghost", () => {
      if (confirm(`Delete "${p.name}" completely?`)) { data.projects.splice(i, 1); markDirty(); renderTab(); }
    });
    list.appendChild(item);
  });
  host.appendChild(list);

  const add = document.createElement("button");
  add.className = "li-add";
  add.textContent = "+ Add new bot / project";
  add.addEventListener("click", () => {
    data.projects.push({ id: "newbot" + Date.now().toString().slice(-4), name: "New Bot", emoji: "🤖", status: "soon", short: "" });
    markDirty();
    editingProject = data.projects.length - 1;
    renderTab();
  });
  host.appendChild(add);
}

function renderProjectEditor(host, idx) {
  const p = data.projects[idx];
  host.innerHTML = "";

  const back = document.createElement("button");
  back.className = "back-link";
  back.textContent = "← Back to all bots";
  back.addEventListener("click", () => { editingProject = -1; renderTab(); });
  host.appendChild(back);

  const h = document.createElement("h2");
  h.textContent = `Edit: ${p.name}`;
  host.appendChild(h);

  const basic = card("Homepage card");
  basic.appendChild(grid(
    fld("Name", p, "name"),
    fld("ID (used in the page URL, lowercase, no spaces)", p, "id", {
      set: (o, v) => { o.id = v.toLowerCase().replace(/[^a-z0-9-]/g, ""); },
    }),
    fld("Emoji", p, "emoji"),
    fld("Status", p, "status", { type: "select", options: ["live", "beta", "soon"] }),
    fld("Short description (shown on the card)", p, "short", { type: "textarea", rows: 3, full: true }),
  ));
  host.appendChild(basic);

  // detail page toggle
  const togCard = card("Detail page");
  const tog = document.createElement("label");
  tog.style.cssText = "display:flex;gap:10px;align-items:center;font-size:0.92rem;cursor:pointer;";
  const cb = document.createElement("input");
  cb.type = "checkbox";
  cb.style.width = "auto";
  cb.checked = !!p.details;
  tog.append(cb, "This bot has its own detail page (hero, features, pricing, FAQ)");
  togCard.appendChild(tog);
  host.appendChild(togCard);

  const detailsHost = document.createElement("div");
  host.appendChild(detailsHost);

  cb.addEventListener("change", () => {
    if (cb.checked) {
      p.details = p._detailsBackup || detailsTemplate(p);
      delete p._detailsBackup;
    } else {
      p._detailsBackup = p.details;   // kept in memory only, never exported
      delete p.details;
    }
    markDirty();
    renderDetails();
  });

  function renderDetails() {
    detailsHost.innerHTML = "";
    if (!p.details) return;
    const d = p.details;

    const heroC = card("Page hero");
    heroC.appendChild(grid(
      fld("Bot username (e.g. @DigiHubProBot)", d, "botUsername"),
      fld("Bot link (https://t.me/…)", d, "botLink"),
      fld("Eyebrow (small text above headline)", d, "eyebrow"),
      fld("Main button label", d, "ctaLabel"),
      fld("Headline", d, "headline", { type: "textarea", rows: 2, full: true }),
      fld("Sub-headline paragraph", d, "sub", { type: "textarea", rows: 3, full: true }),
    ));
    detailsHost.appendChild(heroC);

    const chatC = card("Chat mockup (the phone)");
    chatEditor(chatC, d);
    detailsHost.appendChild(chatC);

    const featC = card("Features (empty = section hidden)");
    const featList = document.createElement("div");
    featC.appendChild(featList);
    d.features = d.features || [];
    listEditor(featList, d.features, (f) => [
      fld("Icon (emoji)", f, "icon"),
      fld("Title", f, "title"),
      fld("Description", f, "desc", { type: "textarea", rows: 2, full: true }),
    ], { icon: "✨", title: "", desc: "" }, "+ Add feature");
    detailsHost.appendChild(featC);

    const stepC = card("How-it-works steps (empty = section hidden)");
    const stepList = document.createElement("div");
    stepC.appendChild(stepList);
    d.steps = d.steps || [];
    listEditor(stepList, d.steps, (s) => [
      fld("Title", s, "title"),
      fld("Description", s, "desc", { type: "textarea", rows: 2, full: true }),
    ], { title: "", desc: "" }, "+ Add step");
    detailsHost.appendChild(stepC);

    const tierC = card("Pricing tiers (empty = section hidden)");
    const tierList = document.createElement("div");
    tierC.appendChild(tierList);
    d.tiers = d.tiers || [];
    listEditor(tierList, d.tiers, (t) => [
      fld("Plan name", t, "name"),
      fld("Price", t, "price"),
      fld("Unit (e.g. ⭐ / mo)", t, "unit"),
      fld("Tag (e.g. Most popular — usually empty)", t, "tag"),
      fld("Perks (one per line)", t, "perks", {
        type: "textarea", rows: 4, full: true,
        get: (o) => (o.perks || []).join("\n"),
        set: (o, v) => { o.perks = v.split("\n").map((s) => s.trim()).filter(Boolean); },
      }),
    ], { name: "", price: "0", unit: "⭐ / mo", tag: "", perks: [] }, "+ Add tier");
    detailsHost.appendChild(tierC);

    const faqC = card("FAQ (empty = section hidden)");
    const faqList = document.createElement("div");
    faqC.appendChild(faqList);
    d.faq = d.faq || [];
    listEditor(faqList, d.faq, (f) => [
      fld("Question", f, "q", { full: true }),
      fld("Answer", f, "a", { type: "textarea", rows: 3, full: true }),
    ], { q: "", a: "" }, "+ Add question");
    detailsHost.appendChild(faqC);

    d.cta = d.cta || { title: "", text: "", btnLabel: "Open in Telegram" };
    const ctaC = card("Bottom call-to-action band");
    ctaC.appendChild(grid(
      fld("Title", d.cta, "title"),
      fld("Button label", d.cta, "btnLabel"),
      fld("Text", d.cta, "text", { type: "textarea", rows: 2, full: true }),
    ));
    detailsHost.appendChild(ctaC);
  }
  renderDetails();
}

/* ============================================================
   TAB: GUIDES
   ============================================================ */
/* Photo/video upload — reads the file client-side and embeds it as a
   data: URI directly in doc.media.src. There's no server here, so this
   is the only way "upload" can work at all — no separate hosting step.
   Keep files small: this ends up inline in config.js, so a large video
   bloats the file and slows every page load, not just the guide page. */
function mediaEditor(host, doc) {
  const wrap = document.createElement("div");
  host.appendChild(wrap);

  function render() {
    wrap.innerHTML = "";
    if (doc.media && doc.media.src) {
      const preview = document.createElement("div");
      preview.className = "media-preview";
      preview.appendChild(
        doc.media.type === "video"
          ? Object.assign(document.createElement("video"), { src: doc.media.src, controls: true })
          : Object.assign(document.createElement("img"), { src: doc.media.src })
      );
      wrap.appendChild(preview);

      const rm = document.createElement("button");
      rm.type = "button";
      rm.className = "btn btn-ghost";
      rm.textContent = "✕ Remove media";
      rm.addEventListener("click", () => { doc.media = null; markDirty(); render(); });
      wrap.appendChild(rm);
      return;
    }

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,video/*";
    input.addEventListener("change", () => {
      const file = input.files[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
        if (!confirm(`That file is ${(file.size / 1024 / 1024).toFixed(1)} MB — it gets embedded directly into config.js and will slow every page load. Use it anyway?`)) {
          input.value = "";
          return;
        }
      }
      const reader = new FileReader();
      reader.onload = () => {
        doc.media = { type: file.type.startsWith("video") ? "video" : "image", src: reader.result };
        markDirty();
        render();
      };
      reader.readAsDataURL(file);
    });
    wrap.appendChild(input);

    const hint = document.createElement("p");
    hint.className = "hint";
    hint.textContent = "Optional — a screenshot or short clip shown under the summary. If you skip this, the page just moves straight to Quick Answers, no empty space left behind. Keep it small (a few hundred KB); it's embedded directly in config.js.";
    wrap.appendChild(hint);
  }
  render();
}

function renderGuidesTab(host) {
  if (editingGuide >= 0) return renderGuideEditor(host, editingGuide);

  host.innerHTML = `<h2>Guides</h2>
    <p class="hint">One page per bot module — opened from the "Guide" button inside that module in the bot itself. Each is a mini help center: a short summary, an optional screenshot or clip, and a Quick Answers FAQ someone can scan in under 30 seconds. The 15 modules here are fixed (they match real buttons in the bot) — edit their content, but they can't be added or removed from this tab.</p>`;

  const list = document.createElement("div");
  list.className = "obj-list";
  data.guides.forEach((doc, i) => {
    const item = document.createElement("div");
    item.className = "obj-item";
    const qaCount = (doc.quickAnswers || []).length;
    const secCount = (doc.sections || []).length;
    const bits = [`${qaCount} quick answer${qaCount === 1 ? "" : "s"}`];
    if (secCount) bits.push(`${secCount} detail section${secCount === 1 ? "" : "s"}`);
    if (doc.media && doc.media.src) bits.push("has media");
    item.innerHTML = `
      <span class="emoji">${doc.icon || "📖"}</span>
      <span class="obj-name">${doc.title || "(untitled)"}
        <small>guide.html?module=${doc.id} · ${bits.join(" · ")}</small>
      </span>`;
    const mk = (txt, cls, fn) => {
      const b = document.createElement("button");
      b.className = "btn " + cls; b.textContent = txt;
      b.addEventListener("click", fn);
      item.appendChild(b);
    };
    mk("Edit", "btn-gold", () => { editingGuide = i; renderTab(); });
    list.appendChild(item);
  });
  host.appendChild(list);
}

function renderGuideEditor(host, idx) {
  const doc = data.guides[idx];
  host.innerHTML = "";

  const back = document.createElement("button");
  back.className = "back-link";
  back.textContent = "← Back to all guides";
  back.addEventListener("click", () => { editingGuide = -1; renderTab(); });
  host.appendChild(back);

  const h = document.createElement("h2");
  h.textContent = `Edit: ${doc.title}`;
  host.appendChild(h);

  const meta = card("Header");
  meta.appendChild(grid(
    fld("Title", doc, "title"),
    fld("Icon (emoji)", doc, "icon"),
    fld("Summary — one line, shown right under the title", doc, "summary", { type: "textarea", rows: 2, full: true }),
  ));
  host.appendChild(meta);

  const mediaC = card("Screenshot or video (optional)");
  mediaEditor(mediaC, doc);
  host.appendChild(mediaC);

  const qaC = card("Quick Answers — the actual point of this page");
  const qaNote = document.createElement("p");
  qaNote.className = "hint";
  qaNote.textContent = "Short, click-to-expand Q&A. Someone should find their answer here in under 30 seconds — 1-2 sentences per answer, not a paragraph.";
  qaC.appendChild(qaNote);
  const qaList = document.createElement("div");
  qaC.appendChild(qaList);
  doc.quickAnswers = doc.quickAnswers || [];
  listEditor(qaList, doc.quickAnswers, (item) => [
    fld("Question", item, "q", { full: true }),
    fld("Answer (1-2 sentences)", item, "a", { type: "textarea", rows: 2, full: true }),
  ], { q: "", a: "" }, "+ Add quick answer");
  host.appendChild(qaC);

  const secC = card("More detail (optional) — in the text box: blank line = new paragraph, lines starting with \"- \" = bullet points");
  const secList = document.createElement("div");
  secC.appendChild(secList);
  doc.sections = doc.sections || [];
  listEditor(secList, doc.sections, (s) => [
    fld("Heading", s, "h", { full: true }),
    fld("Content", s, "body", {
      type: "textarea", rows: 6, full: true,
      get: (o) => bodyToText(o.body),
      set: (o, v) => { o.body = textToBody(v); },
    }),
  ], { h: "New section", body: [] }, "+ Add section");
  host.appendChild(secC);
}

/* ============================================================
   TAB: LEGAL
   ============================================================ */
function renderLegalTab(host) {
  if (editingLegal >= 0) return renderLegalEditor(host, editingLegal);

  host.innerHTML = `<h2>Legal pages</h2>
    <p class="hint">Privacy Policy, Terms &amp; Conditions, Refund Policy — any document. Each appears in the footer automatically.</p>`;

  const list = document.createElement("div");
  list.className = "obj-list";
  data.legal.forEach((doc, i) => {
    const item = document.createElement("div");
    item.className = "obj-item";
    item.innerHTML = `
      <span class="emoji">📄</span>
      <span class="obj-name">${doc.title || "(untitled)"}
        <small>legal.html?doc=${doc.id} · updated ${doc.updated || "—"}</small>
      </span>`;
    const mk = (txt, cls, fn) => {
      const b = document.createElement("button");
      b.className = "btn " + cls; b.textContent = txt;
      b.addEventListener("click", fn);
      item.appendChild(b);
    };
    mk("Edit", "btn-gold", () => { editingLegal = i; renderTab(); });
    mk("Delete", "btn-ghost", () => {
      if (confirm(`Delete "${doc.title}"?`)) { data.legal.splice(i, 1); markDirty(); renderTab(); }
    });
    list.appendChild(item);
  });
  host.appendChild(list);

  const add = document.createElement("button");
  add.className = "li-add";
  add.textContent = "+ Add new legal document";
  add.addEventListener("click", () => {
    data.legal.push({
      id: "newdoc" + Date.now().toString().slice(-4),
      title: "New Document",
      updated: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      intro: "",
      sections: [],
    });
    markDirty();
    editingLegal = data.legal.length - 1;
    renderTab();
  });
  host.appendChild(add);
}

function renderLegalEditor(host, idx) {
  const doc = data.legal[idx];
  host.innerHTML = "";

  const back = document.createElement("button");
  back.className = "back-link";
  back.textContent = "← Back to all documents";
  back.addEventListener("click", () => { editingLegal = -1; renderTab(); });
  host.appendChild(back);

  const h = document.createElement("h2");
  h.textContent = `Edit: ${doc.title}`;
  host.appendChild(h);

  const meta = card("Document");
  meta.appendChild(grid(
    fld("Title", doc, "title"),
    fld("ID (used in the URL, lowercase)", doc, "id", {
      set: (o, v) => { o.id = v.toLowerCase().replace(/[^a-z0-9-]/g, ""); },
    }),
    fld("Last updated (shown under the title)", doc, "updated"),
    fld("Intro paragraph", doc, "intro", { type: "textarea", rows: 3, full: true }),
  ));
  host.appendChild(meta);

  const secC = card("Sections — in the text box: blank line = new paragraph, lines starting with \"- \" = bullet points");
  const secList = document.createElement("div");
  secC.appendChild(secList);
  doc.sections = doc.sections || [];
  listEditor(secList, doc.sections, (s) => [
    fld("Heading", s, "h", { full: true }),
    fld("Content", s, "body", {
      type: "textarea", rows: 6, full: true,
      get: (o) => bodyToText(o.body),
      set: (o, v) => { o.body = textToBody(v); },
    }),
  ], { h: "New section", body: [] }, "+ Add section");
  host.appendChild(secC);
}

/* ============================================================
   TAB: PUBLISH
   ============================================================ */
function genConfig() {
  const j = (v) => JSON.stringify(v, stripPrivate, 2);
  return `/* ============================================================
   DIGIHUB PORTAL — SITE CONFIG
   Generated by the DiGiHub Admin Panel on ${new Date().toISOString()}
   You can still edit this file by hand — or use admin.html.
   ============================================================ */

const SITE = ${j(data.site)};

const PROJECTS = ${j(data.projects)};

const LEGAL = ${j(data.legal)};

const GUIDES = ${j(data.guides)};
`;
}

function ghSettings() {
  try { return JSON.parse(localStorage.getItem(GH_KEY)) || {}; } catch (e) { return {}; }
}

function renderPublishTab(host) {
  host.innerHTML = `<h2>Publish</h2>
    <p class="hint">Your edits live in a local draft until you publish. Publishing = putting the new <code class="inline">config.js</code> on your host.</p>`;

  const how = card("How publishing works");
  how.innerHTML += `
    <div class="pub-step"><span class="n">1</span><p>Edit content in the other tabs and <b>Save draft</b>. Use <b>Preview site</b> to check it — only you can see the draft.</p></div>
    <div class="pub-step"><span class="n">2</span><p>Download the generated <code class="inline">config.js</code> below and replace <code class="inline">assets/js/config.js</code> on your host (or in your GitHub repo — Cloudflare/GitHub Pages redeploys automatically).</p></div>
    <div class="pub-step"><span class="n">3</span><p>Or connect GitHub below and publish with one click.</p></div>`;
  host.appendChild(how);

  const dl = card("Export config.js");
  const row = document.createElement("div");
  row.style.cssText = "display:flex;gap:12px;flex-wrap:wrap;";
  const dBtn = document.createElement("button");
  dBtn.className = "btn btn-gold";
  dBtn.textContent = "⬇ Download config.js";
  dBtn.addEventListener("click", () => {
    const blob = new Blob([genConfig()], { type: "text/javascript" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "config.js";
    a.click();
    URL.revokeObjectURL(a.href);
    toast("config.js downloaded — replace assets/js/config.js with it.");
  });
  const cBtn = document.createElement("button");
  cBtn.className = "btn btn-ghost";
  cBtn.textContent = "📋 Copy to clipboard";
  cBtn.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(genConfig()); toast("Copied ✓"); }
    catch (e) { toast("Copy failed — use Download instead."); }
  });
  row.append(dBtn, cBtn);
  dl.appendChild(row);
  host.appendChild(dl);

  /* GitHub one-click publish */
  const gh = card("One-click publish via GitHub (optional)");
  const note = document.createElement("p");
  note.className = "hint";
  note.innerHTML = `If the site is hosted from a GitHub repo (GitHub Pages / Cloudflare Pages), this commits the new config directly.
    Create a fine-grained token with <b>Contents: read &amp; write</b> on that one repo only. The token is saved in this browser only — never put it inside the website files.`;
  gh.appendChild(note);

  const s = ghSettings();
  const ghForm = grid(
    fld("Repository (owner/name, e.g. mohit/digihub-site)", s, "repo"),
    fld("Branch", s, "branch", { placeholder: "main" }),
    fld("File path in repo", s, "path", { placeholder: "assets/js/config.js" }),
    fld("GitHub token", s, "token", { placeholder: "github_pat_…" }),
  );
  gh.appendChild(ghForm);

  const pubBtn = document.createElement("button");
  pubBtn.className = "btn btn-gold";
  pubBtn.style.marginTop = "14px";
  pubBtn.textContent = "🚀 Publish to GitHub";
  pubBtn.addEventListener("click", async () => {
    localStorage.setItem(GH_KEY, JSON.stringify(s));
    if (!s.repo || !s.token) return toast("Fill in repository and token first.");
    const branch = s.branch || "main";
    const path = s.path || "assets/js/config.js";
    const api = `https://api.github.com/repos/${s.repo}/contents/${path}`;
    const headers = { Authorization: `Bearer ${s.token}`, Accept: "application/vnd.github+json" };
    pubBtn.disabled = true;
    pubBtn.textContent = "Publishing…";
    try {
      let sha;
      const cur = await fetch(`${api}?ref=${encodeURIComponent(branch)}`, { headers });
      if (cur.ok) sha = (await cur.json()).sha;
      const content = btoa(unescape(encodeURIComponent(genConfig())));
      const res = await fetch(api, {
        method: "PUT",
        headers,
        body: JSON.stringify({ message: "Update site content via admin panel", content, branch, sha }),
      });
      if (!res.ok) throw new Error((await res.json()).message || res.statusText);
      toast("Published ✓ — your host will redeploy in a minute.");
    } catch (e) {
      toast("Publish failed: " + e.message, 5000);
    } finally {
      pubBtn.disabled = false;
      pubBtn.textContent = "🚀 Publish to GitHub";
    }
  });
  gh.appendChild(pubBtn);
  host.appendChild(gh);

  const danger = card("Draft");
  const disc = document.createElement("button");
  disc.className = "btn btn-ghost";
  disc.textContent = "🗑 Discard draft (reload published content)";
  disc.addEventListener("click", () => {
    if (confirm("Throw away ALL unsaved and saved draft changes, and reload from config.js?")) {
      localStorage.removeItem(DRAFT_KEY);
      location.reload();
    }
  });
  danger.appendChild(disc);
  host.appendChild(danger);
}

/* ============================================================
   TABS + BOOT
   ============================================================ */
function renderTab() {
  const host = $("#tab-content");
  host.innerHTML = "";
  if (currentTab === "site") renderSiteTab(host);
  else if (currentTab === "projects") renderProjectsTab(host);
  else if (currentTab === "guides") renderGuidesTab(host);
  else if (currentTab === "legal") renderLegalTab(host);
  else renderPublishTab(host);
}

function showPanel() {
  $("#login-view").hidden = true;
  $("#panel-view").hidden = false;
  data = loadData();
  renderTab();
}

document.addEventListener("DOMContentLoaded", () => {
  const authed = sessionStorage.getItem(SESSION_KEY) === ADMIN.passHash;
  if (authed) showPanel();
  else $("#login-view").hidden = false;

  $("#login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const u = $("#login-user").value.trim();
    const pw = $("#login-pass").value;
    try {
      const hash = await sha256(`${u}:${pw}`);
      if (u === ADMIN.username && hash === ADMIN.passHash) {
        sessionStorage.setItem(SESSION_KEY, ADMIN.passHash);
        showPanel();
      } else {
        $("#login-error").hidden = false;
      }
    } catch (err) {
      $("#login-error").textContent = err.message;
      $("#login-error").hidden = false;
    }
  });

  $("#btn-logout").addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    location.reload();
  });

  $("#btn-save").addEventListener("click", saveDraft);

  $("#admin-tabs").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-tab]");
    if (!b) return;
    currentTab = b.dataset.tab;
    editingProject = -1;
    editingLegal = -1;
    editingGuide = -1;
    document.querySelectorAll("#admin-tabs button").forEach((x) => x.classList.toggle("active", x === b));
    renderTab();
  });

  window.addEventListener("beforeunload", (e) => {
    if (dirty) { e.preventDefault(); e.returnValue = ""; }
  });
});
