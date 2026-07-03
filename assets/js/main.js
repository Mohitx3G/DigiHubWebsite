/* ============================================================
   main.js — generic renderer. Reads config.js (or an unpublished
   admin draft from localStorage) and builds every page.
   You should almost never need to edit this file:
   ALL content changes happen in config.js or the admin panel.
   ============================================================ */

/* ---------- helpers ---------- */
const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const param = (name) => new URLSearchParams(location.search).get(name);
const extAttrs = (href) => /^https?:\/\//.test(href) ? `target="_blank" rel="noopener"` : "";

/* ---------- content source: config.js OR admin draft ----------
   The admin panel (admin.html) saves work-in-progress content to
   localStorage. If a draft exists IN THIS BROWSER, the site shows
   it with a "draft" banner so you can preview before publishing.
   Visitors never have that key, so they always see config.js. */
const DRAFT_KEY = "digihub_draft_v1";
let CONF = { site: SITE, projects: PROJECTS, legal: LEGAL };
let IS_DRAFT = false;
try {
  if (typeof localStorage !== "undefined") {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
      const d = JSON.parse(raw);
      if (d && d.site && d.projects && d.legal) { CONF = d; IS_DRAFT = true; }
    }
  }
} catch (e) { /* storage unavailable — fall back to config.js */ }

/* ---------- shared: animated background ---------- */
function renderBackground() {
  const fx = document.createElement("div");
  fx.className = "bg-fx";
  fx.setAttribute("aria-hidden", "true");
  fx.innerHTML = `<span class="stars"></span><span class="b1"></span><span class="b2"></span><span class="b3"></span><span class="gold-light"></span><span class="sheen"></span>`;
  document.body.prepend(fx);
}

/* ---------- shared: draft preview banner ---------- */
function renderDraftBanner() {
  if (!IS_DRAFT) return;
  const bar = document.createElement("div");
  bar.className = "draft-banner";
  bar.innerHTML = `
    <span>📝 You're previewing an <b>unpublished draft</b> — visitors still see the live version.</span>
    <span class="draft-actions">
      <a href="admin.html">Open admin panel</a>
      <button type="button" id="draft-discard">Discard draft</button>
    </span>`;
  document.body.prepend(bar);
  bar.querySelector("#draft-discard").addEventListener("click", () => {
    if (confirm("Discard the draft and go back to the published content?")) {
      localStorage.removeItem(DRAFT_KEY);
      location.reload();
    }
  });
}

/* ---------- shared: scroll-reveal animation ---------- */
function initReveal() {
  if (typeof IntersectionObserver === "undefined") return;
  const els = document.querySelectorAll(".card, .step, .tier, .faq details, .cta-band");
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("shown"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  els.forEach((el) => { el.classList.add("reveal"); io.observe(el); });
}

/* ---------- shared: nav + footer ---------- */
function renderChrome(activeId) {
  const page = document.body.dataset.page || "";
  const site = CONF.site;

  // Nav auto-lists every project that has a details page.
  const projectLinks = CONF.projects.filter((p) => p.details).map((p) =>
    `<a href="project.html?id=${encodeURIComponent(p.id)}"
        class="${page === "project" && activeId === p.id ? "active" : ""}">${esc(p.name)}</a>`
  ).join("");

  const brandMark = site.logo
    ? `<img class="dot" src="${esc(site.logo)}" alt="" />`
    : `<span class="dot">🤖</span>`;

  $("#nav").innerHTML = `
    <div class="wrap nav-inner">
      <a class="nav-brand" href="index.html">${brandMark}${esc(site.brand)}</a>
      <button type="button" class="nav-toggle" id="nav-toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="nav-links">
        <span></span><span></span><span></span>
      </button>
      <nav class="nav-links" id="nav-links">
        <a href="index.html" class="${page === "home" ? "active" : ""}">Projects</a>
        ${projectLinks}
        <a class="btn btn-primary" href="${esc(site.telegram)}" target="_blank" rel="noopener">Open in Telegram</a>
      </nav>
    </div>`;

  // Mobile hamburger: toggles the dropdown, closes on link tap.
  const navToggle = $("#nav-toggle");
  const navLinks = $("#nav-links");
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }));

  // Footer auto-lists every legal document.
  const legalLinks = CONF.legal.map((d) =>
    `<a href="legal.html?doc=${encodeURIComponent(d.id)}">${esc(d.title)}</a>`
  ).join(" · ");

  $("#footer").innerHTML = `
    <div class="wrap foot-inner">
      <div>
        <div>© ${site.year} ${esc(site.brand)} — ${esc(site.tagline)}</div>
        <div class="foot-legal">${legalLinks}</div>
      </div>
      <div class="foot-contact">
        <a href="${esc(site.telegram)}" target="_blank" rel="noopener">Support on Telegram →</a>
        ${site.email ? `<a href="mailto:${esc(site.email)}">${esc(site.email)}</a>` : ""}
      </div>
    </div>`;
}

/* ---------- shared: Telegram chat mockup ---------- */
function chatHTML(chat, ariaLabel) {
  if (!chat || !chat.messages || !chat.messages.length) return "";
  const msgs = chat.messages.map((m, i) => `
    <div class="msg ${m.side === "out" ? "out" : "in"}" style="animation-delay:${(0.15 + i * 0.6).toFixed(2)}s">
      ${m.html}
      ${m.buttons && m.buttons.length ? `<div class="kb">${m.buttons.map((b) => `<span>${b}</span>`).join("")}</div>` : ""}
      ${m.time ? `<span class="time">${esc(m.time)}</span>` : ""}
    </div>`).join("");
  return `
    <div class="phone" aria-label="${esc(ariaLabel || "Example Telegram conversation")}">
      <div class="phone-top">
        <div class="avatar">${chat.avatar || "🤖"}</div>
        <div class="who"><b>${esc(chat.botName || CONF.site.brand)}</b><span>online</span></div>
      </div>
      <div class="chat">${msgs}</div>
    </div>`;
}

/* ============================================================
   HOMEPAGE
   ============================================================ */
function renderHome() {
  if (document.body.dataset.page !== "home") return;
  const h = CONF.site.hero;

  $("#home-hero").innerHTML = `
    <div>
      <span class="eyebrow">${esc(h.eyebrow)}</span>
      <h1>${h.title}</h1>
      <p class="lead">${esc(h.lead)}</p>
      <div class="actions">
        <a class="btn btn-primary" href="${esc(h.primaryBtn.href)}" ${extAttrs(h.primaryBtn.href)}>${esc(h.primaryBtn.label)}</a>
        <a class="btn btn-ghost" href="${esc(h.ghostBtn.href)}" ${extAttrs(h.ghostBtn.href)}>${esc(h.ghostBtn.label)}</a>
      </div>
    </div>
    <div class="phone-stack">
      ${h.chatSecondary ? `<div class="phone-secondary">${chatHTML(h.chatSecondary, "Example feedback and broadcast conversation")}</div>` : ""}
      <div class="phone-primary">${chatHTML(h.chat, "Example purchase conversation")}</div>
    </div>`;

  $("#features-eyebrow").textContent = CONF.site.featuresEyebrow || "// Features";
  $("#features-title").textContent = CONF.site.featuresTitle || "Features";
  $("#features-grid").innerHTML = (CONF.site.features || []).map((f) => `
    <div class="card feature">
      <div class="emoji">${f.icon}</div>
      <h3>${esc(f.title)}</h3>
      <p>${esc(f.desc)}</p>
    </div>`).join("");

  $("#projects-grid").innerHTML = CONF.projects.map((p) => {
    const badge = `<span class="status ${p.status}">${p.status === "soon" ? "coming soon" : p.status}</span>`;
    const href = p.details ? `project.html?id=${encodeURIComponent(p.id)}` : "";
    const inner = `
      ${badge}
      <div class="emoji">${p.emoji}</div>
      <h3>${esc(p.name)}</h3>
      <p>${esc(p.short)}</p>
      ${href ? `<div class="card-foot">View project →</div>` : ""}`;
    return href
      ? `<a class="card" href="${href}">${inner}</a>`
      : `<div class="card">${inner}</div>`;
  }).join("");

  $("#highlights-grid").innerHTML = (CONF.site.highlights || []).map((f) => `
    <div class="card feature">
      <div class="emoji">${f.icon}</div>
      <h3>${esc(f.title)}</h3>
      <p>${esc(f.desc)}</p>
    </div>`).join("");
}

/* ============================================================
   PROJECT PAGE — universal, renders any project that has a
   `details` block. URL: project.html?id=<project id>
   Sections render only if their array/object exists & is non-empty.
   ============================================================ */
function renderProject() {
  if (document.body.dataset.page !== "project") return null;

  const id = param("id");
  const p = CONF.projects.find((x) => x.id === id && x.details);

  if (!p) {
    document.title = `Project not found — ${CONF.site.brand}`;
    $("#project-main").innerHTML = `
      <div class="wrap notfound">
        <h1>Project not found</h1>
        <p class="lead">The project you're looking for doesn't exist (yet).</p>
        <div class="actions"><a class="btn btn-primary" href="index.html">← All projects</a></div>
      </div>`;
    return null;
  }

  const d = p.details;
  document.title = `${p.name} — ${CONF.site.brand}`;

  const features = (d.features && d.features.length) ? `
    <section class="alt">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow">// Features</span>
          <h2>Everything ${esc(p.name)} gives you</h2>
        </div>
        <div class="grid cols-3">${d.features.map((f) => `
          <div class="card feature">
            <div class="emoji">${f.icon}</div>
            <h3>${esc(f.title)}</h3>
            <p>${esc(f.desc)}</p>
          </div>`).join("")}
        </div>
      </div>
    </section>` : "";

  const steps = (d.steps && d.steps.length) ? `
    <section>
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow">// How it works</span>
          <h2>Live in ${["zero","one","two","three","four","five","six"][d.steps.length] || d.steps.length} steps</h2>
        </div>
        <div class="steps">${d.steps.map((s) => `
          <div class="step"><h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p></div>`).join("")}
        </div>
      </div>
    </section>` : "";

  const tiers = (d.tiers && d.tiers.length) ? `
    <section class="alt" id="pricing">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow">// Pricing</span>
          <h2>Pay in Stars, upgrade any time</h2>
        </div>
        <div class="tiers">${d.tiers.map((t) => `
          <div class="tier ${t.tag ? "popular" : ""}">
            ${t.tag ? `<span class="tag">${esc(t.tag)}</span>` : ""}
            <h3>${esc(t.name)}</h3>
            <div class="price">${esc(t.price)} <span class="unit">${esc(t.unit)}</span></div>
            <ul>${t.perks.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
            <a class="btn ${t.tag ? "btn-primary" : "btn-ghost"}" href="${esc(d.botLink)}" target="_blank" rel="noopener">Choose ${esc(t.name)}</a>
          </div>`).join("")}
        </div>
      </div>
    </section>` : "";

  const faq = (d.faq && d.faq.length) ? `
    <section>
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow">// FAQ</span>
          <h2>Common questions</h2>
        </div>
        <div class="faq">${d.faq.map((f) => `
          <details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}
        </div>
      </div>
    </section>` : "";

  const cta = d.cta ? `
    <section>
      <div class="wrap">
        <div class="cta-band">
          <h2>${esc(d.cta.title)}</h2>
          <p>${esc(d.cta.text)}</p>
          <a class="btn btn-primary" href="${esc(d.botLink)}" target="_blank" rel="noopener">${esc(d.cta.btnLabel)}</a>
        </div>
      </div>
    </section>` : "";

  $("#project-main").innerHTML = `
    <div class="wrap hero">
      <div>
        <span class="eyebrow">${esc(d.eyebrow || `// ${p.name}`)}</span>
        <h1>${esc(d.headline)}</h1>
        <p class="lead">${esc(d.sub)}</p>
        <div class="actions">
          <a class="btn btn-primary" href="${esc(d.botLink)}" target="_blank" rel="noopener">${esc(d.ctaLabel || "Open in Telegram")}</a>
          ${(d.tiers && d.tiers.length) ? `<a class="btn btn-ghost" href="#pricing">See pricing</a>` : ""}
        </div>
      </div>
      ${chatHTML(d.chat, `Example ${p.name} conversation`)}
    </div>
    ${features}${steps}${tiers}${faq}${cta}`;

  return p.id;
}

/* ============================================================
   LEGAL PAGE — universal, renders any LEGAL entry.
   URL: legal.html?doc=<doc id>   e.g. legal.html?doc=privacy
   ============================================================ */
function renderLegal() {
  if (document.body.dataset.page !== "legal") return;

  const id = param("doc");
  const doc = CONF.legal.find((x) => x.id === id) || CONF.legal[0];
  if (!doc) return;

  document.title = `${doc.title} — ${CONF.site.brand}`;

  const bodyHTML = (items) => items.map((item) =>
    (item && item.list)
      ? `<ul>${item.list.map((li) => `<li>${esc(li)}</li>`).join("")}</ul>`
      : `<p>${esc(item)}</p>`
  ).join("");

  $("#legal-main").innerHTML = `
    <div class="wrap legal">
      <span class="eyebrow">// ${esc(CONF.site.brand)} · legal</span>
      <h1>${esc(doc.title)}</h1>
      <p class="updated">Last updated: ${esc(doc.updated)}</p>
      ${doc.intro ? `<p class="lead">${esc(doc.intro)}</p>` : ""}
      ${doc.sections.map((s) => `
        <section class="legal-section">
          <h2>${esc(s.h)}</h2>
          ${bodyHTML(s.body)}
        </section>`).join("")}
      <div class="legal-nav">
        ${CONF.legal.filter((x) => x.id !== doc.id).map((x) =>
          `<a href="legal.html?doc=${encodeURIComponent(x.id)}">${esc(x.title)} →</a>`).join("")}
      </div>
    </div>`;
}

/* ---------- boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderBackground();
  renderDraftBanner();
  const activeProject = renderProject();
  renderChrome(activeProject);
  renderHome();
  renderLegal();
  initReveal();
});
