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

## Hosting (free, zero maintenance)

Upload this folder to any static host:

- **Cloudflare Pages** (recommended — free, fast in India, custom domain)
- **GitHub Pages** — push to a repo, enable Pages in settings
- **Netlify / Vercel** — drag-and-drop the folder

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
