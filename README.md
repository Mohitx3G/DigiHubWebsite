# DiGiHub — Bots Portal Website

Pure static site: **HTML + CSS + vanilla JS**. No build step, no framework,
no backend, nothing to keep running. Upload the folder anywhere and it works.

## The one rule

> **All content lives in `assets/js/config.js`.**
> Edit it by hand — or use the **admin panel** (`admin.html`), no code at all.

You never need to touch HTML to add a bot or a legal page.

## Admin panel (`admin.html`)

Open `admin.html`, sign in, and manage everything visually:

| Tab | What you manage |
|---|---|
| **Site** | Brand, logo, links, homepage hero + chat mockup, "How we build" cards |
| **Bots / Projects** | Add / edit / delete / reorder bots — including full detail pages (features, steps, pricing, FAQ, chat mockup) |
| **Guides** | Edit each module's Help Center page — summary, screenshot/video upload, Quick Answers FAQ, optional deeper sections |
| **Legal pages** | Privacy Policy, Terms, or any new document |
| **Publish** | Download / copy the new `config.js`, or one-click publish via GitHub |

**How it works:** your edits are saved as a **draft in your browser**
(💾 Save draft). Click *Preview site* — you'll see the draft with a gold
banner; visitors still see the live version. When happy, go to **Publish**:
either download `config.js` and replace `assets/js/config.js` on your host,
or connect a GitHub token for one-click publishing.

**Changing the admin password:** run
`node -e "console.log(require('crypto').createHash('sha256').update('USERNAME:NEWPASSWORD').digest('hex'))"`
and put the result in `ADMIN.passHash` at the top of `assets/js/admin.js`.

**Security note (be realistic):** this is a static site, so the login only
gates the admin *UI*. Nobody can change the live website through it — publishing
requires your hosting / GitHub access. Never put a GitHub token inside the
website files; the panel keeps it in your browser only.

## Pages

| URL | What it shows | Controlled by |
|---|---|---|
| `index.html` | Homepage — hero, project cards, highlights | `SITE` + `PROJECTS` |
| `project.html?id=digihub` | Full page for ANY bot | that bot's `details` block in `PROJECTS` |
| `legal.html?doc=privacy` | Privacy Policy | `LEGAL` array |
| `legal.html?doc=terms` | Terms & Conditions | `LEGAL` array |
| `guide.html?module=shop` | Help Center page for one bot module | `GUIDES` array |

## Add a new bot project

1. Open `assets/js/config.js`
2. Copy an existing object in the `PROJECTS` array (e.g. the `requestaccepter` one)
3. Change `id`, `name`, `emoji`, `status`, `short` and the content inside `details`
4. Save. The bot now has:
   - a card on the homepage (linked automatically)
   - its own page at `project.html?id=<your-id>`
   - a link in the top navigation

**Every section inside `details` is optional.** No pricing yet? Set `tiers: []`
and the pricing section disappears. Same for `features`, `steps`, `faq`, `chat`, `cta`.

A project **without** a `details` block (like Group Manager) shows as a
plain "coming soon" card with no link — add `details` later when it's ready.

## Add / edit legal pages (privacy, terms, refund policy…)

The `LEGAL` array in `config.js` holds every legal document.
To add a new one (e.g. a Refund Policy):

1. Copy one of the existing objects in `LEGAL`
2. Change `id: "refund"`, `title: "Refund Policy"`, `updated`, `intro` and `sections`
3. Save. It's now live at `legal.html?doc=refund` and appears in the footer automatically.

Section format:

```js
{ h: "1. Heading", body: [
    "A normal paragraph.",
    { list: ["bullet one", "bullet two"] },
    "Another paragraph.",
]}
```

## Edit a module's Guide (Help Center page)

The `GUIDES` array in `config.js` holds one entry per bot module — each is
linked from a "Guide" button inside that module in the bot itself, at
`guide.html?module=<id>`. The 15 module IDs are fixed (they match real
buttons already wired into the bot's code), so entries can be edited but not
added or removed from this array without also changing the bot's code.

Each entry is a mini help center, built to answer a question in under 30
seconds — not a manual:

- `summary` — one line, shown at the top
- `media` — optional screenshot or short clip (`{ type: "image"|"video", src }`).
  Set `media: null` and the page just skips it — no empty placeholder box.
  The admin panel's Guides tab can upload a file directly (it gets embedded
  as a `data:` URI in `config.js` — keep it small, a few hundred KB, since
  there's no separate file host on a static site).
- `quickAnswers` — the actual point of the page: a list of `{q, a}` pairs
  rendered as a click-to-expand FAQ. Keep answers to 1-2 sentences.
- `sections` — optional, for anyone who wants more than Quick Answers gives.
  Same `{h, body}` shape as `LEGAL` above.

## Change brand, links, contact

Everything is in the `SITE` object at the top of `config.js`:
brand name, tagline, Telegram links, contact email, homepage hero text,
the animated Telegram chat mockup, and the "How we build" cards.

## Colors & fonts

All design tokens are CSS variables in the `:root` block at the top of
`assets/css/style.css`. Change `--accent`, `--star`, etc. once and the
whole site updates.

## Preview locally

Just double-click `index.html` — it works from disk.
(Or run `python -m http.server` in this folder and open http://localhost:8000)

## Deploy

The live site (digihubhmax.com, behind Cloudflare) is deployed with:

```bash
deploy/deploy.sh
```

That one command does the whole pipeline — content-hashes `style.css`,
`main.js`, `admin.css` and `admin.js`, rewrites every HTML file's
`<link>`/`<script>` tags to point at the hashed names, ships the result to
the VPS as a new release directory, and atomically flips the live symlink
to it. Nothing about this needs a manual Cloudflare cache purge, ever —
see "Caching strategy" below for why.

Requires SSH access to the VPS (`digihub@169.58.15.224`) with a key the
agent can use non-interactively — on Windows, run it from a shell where
the OpenSSH agent is reachable (PowerShell, not Git Bash, on this
machine — Git Bash's bundled `ssh` can't reach the Windows agent pipe).

### Caching strategy

Two tiers, so nothing is ever stuck stale and nothing is ever
unnecessarily re-fetched:

- **Hashed assets** (`style.<hash>.css`, `main.<hash>.js`, …) — cached for
  a year, `immutable`, by both Cloudflare and the browser. Safe because
  the filename itself changes whenever the content does; the old URL is
  never referenced again once deploy.sh rewrites the HTML, so there's
  nothing to invalidate.
- **Fixed-filename files** (the `*.html` pages, `assets/js/config.js`,
  `assets/img/logo.jpg`) — `Cache-Control: no-store`. These can change
  independently of a code deploy (the admin panel publishes straight to
  `config.js`), so their filenames have to stay fixed — which means
  Cloudflare has to be told, unambiguously, never to cache them at the
  edge. A bare `no-cache` isn't enough for that: Cloudflare still caches
  the object and falls back to its own default edge TTL (4h, the exact
  bug this replaced) for how long it holds it. `no-store` is the one
  directive Cloudflare genuinely bypasses its cache for — verified live,
  see `deploy/nginx.conf`'s comments.

If you ever add a new fixed-filename static file that changes outside a
deploy, give it the same `no-store` treatment in `deploy/nginx.conf`
rather than leaving it to Cloudflare's defaults.

## Structure

```
index.html            → homepage
project.html          → universal bot page   (?id=digihub, ?id=requestaccepter, …)
legal.html            → universal legal page (?doc=privacy, ?doc=terms, …)
assets/
  css/style.css       → design system (all tokens in :root)
  js/config.js        → ★ EDIT THIS — controls the entire site
  js/main.js          → generic renderer (rarely needs changes)
```
