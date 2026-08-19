/* ============================================================
   DIGIHUB PORTAL — SITE CONFIG
   This ONE file controls the entire website.
   No HTML knowledge needed. Save the file, refresh the browser.

   ── HOW TO ──────────────────────────────────────────────────
   • Add a new bot        → add an object to PROJECTS below.
                            Give it `details: {...}` and it
                            automatically gets its own full page
                            at  project.html?id=<its id>
   • Add a legal page     → add an object to LEGAL below.
                            It automatically appears in the
                            footer at  legal.html?doc=<its id>
   • Change brand/links   → edit SITE below.
   ============================================================ */

const SITE = {
  brand: "DiGiHub",
  logo: "assets/img/logo.jpg",                // shown in nav; "" = 🤖 emoji fallback
  tagline: "Telegram bot platforms and creator tools, built to scale.",
  telegram: "https://t.me/DigiHubProBot",           // "Open/Try in Telegram" CTAs — the actual product bot
  supportChannel: "https://t.me/DigiHubSupportBot", // footer "Support on Telegram" link
  email: "contact@digihubhmax.com",                 // footer contact — general inquiries
  year: 2026,

  /* Homepage hero */
  hero: {
    eyebrow: "// Telegram bot platforms for admins",
    title: "One bot for your whole community — <span class='hl'>not just a store</span>.",
    lead: "DigiHub gives creators a complete toolkit inside Telegram — a store, custom menus, forms, auto-replies, broadcasts, coupons, giveaways, live chat and channel-gated access — all running under your own bot, on your own brand.",
    primaryBtn: { label: "See all modules", href: "#bots" },
    ghostBtn: { label: "Try it on Telegram", href: "https://t.me/DigiHubProBot" },
    /* Telegram chat mockup shown beside the hero.
       side: "in" = bot message, "out" = user message.
       `html` may contain simple tags like <b>, <br>, spans.
       avatar: an emoji, or an <img> tag for a real logo. */
    chat: {
      avatar: "<img src='assets/img/logo.jpg' alt='' />",
      botName: "DigiHub Store",
      messages: [
        { side: "out", html: "Hi! I want the Notion templates pack", time: "14:02" },
        { side: "in",  html: "📦 <b>Notion Creator Pack</b><br />40+ templates · instant delivery", time: "14:02",
          buttons: ["Buy for <b class='star'>★ 150</b>", "‹ Back to store"] },
        { side: "out", html: "<span class='star'>★ 150</span> paid ✓", time: "14:03" },
        { side: "in",  html: "✅ Payment received — here's your pack!<br />📎 notion-creator-pack.zip", time: "14:03" },
      ],
    },
    /* Second, smaller mockup shown left of the main one —
       proves the bot does more than sell. Set to null to hide it. */
    chatSecondary: {
      avatar: "<img src='assets/img/logo.jpg' alt='' />",
      botName: "DigiHub Admin",
      messages: [
        { side: "out", html: "/broadcast Flash sale today only 🔥", time: "11:05" },
        { side: "in",  html: "📣 Broadcasting to segment <b>VIP buyers</b> (1,842)…<br />✅ Delivered in 4s", time: "11:05" },
        { side: "in",  html: "🤖 Auto-reply active: \"delivery\" → instant answer sent to 12 customers today", time: "11:09" },
      ],
    },
  },

  /* Homepage "How we build" cards */
  highlights: [
    { icon: "🧩", title: "Multi-tenant by design", desc: "Every platform lets users clone their own branded bot. One codebase, thousands of independent bots." },
    { icon: "🧹", title: "Clean, spam-free UX", desc: "Inline menus with proper back-button flows. Setup messages, tokens and stray text are auto-deleted after use." },
    { icon: "🚀", title: "Built for scale", desc: "Webhooks, Redis-backed state and PostgreSQL under the hood — designed for groups and audiences in the millions." },
  ],
};

/* ============================================================
   PROJECTS — each object becomes a card on the homepage.
   status : "live" | "beta" | "soon"
   details: give a project this block and it gets a full page
            at project.html?id=<id> automatically. Every section
            inside details is OPTIONAL — leave an array empty
            (or delete it) and that section simply won't show.
   ============================================================ */
const PROJECTS = [
  {
    id: "digihub",
    name: "DigiHub",
    emoji: "🛍️",
    status: "live",
    short: "More than a store: menus, forms, broadcasts, auto-replies and coupons — all on your own branded bot, with Stars payments and instant delivery.",
    details: {
      botUsername: "@DigiHubProBot",
      botLink: "https://t.me/DigiHubProBot",
      eyebrow: "// DigiHub · live",
      headline: "Your whole Telegram toolkit, running on your own bot.",
      sub: "DigiHub lets creators launch a fully-loaded bot in minutes — a store, custom menus, forms, auto-replies, broadcasts and coupons — all running under your own brand, with your files staying in your own private channel.",
      ctaLabel: "Get started — it's free",

      chat: {
        avatar: "<img src='assets/img/logo.jpg' alt='' />",
        botName: "DigiHub",
        messages: [
          { side: "out", html: "/mystore", time: "09:41" },
          { side: "in",  html: "🏪 <b>Your store — this week</b><br />Orders: 34 · Revenue: <b class='star'>★ 4,120</b>", time: "09:41",
            buttons: ["📦 Products", "📊 Full stats", "‹ Back"] },
          { side: "in",  html: "🔔 New sale! <b>UI Icons Pack</b> — <span class='star'>★ 99</span><br />Delivered automatically ✓", time: "09:44" },
        ],
      },

      features: [
        { icon: "🤖", title: "Your own clone bot", desc: "Connect a bot token and get a fully branded bot under your name — not ours. Your community only ever sees your brand." },
        { icon: "🛍️", title: "Shop & Stars payments", desc: "Sell digital products with native Telegram Stars — files stay in your channel, buyers get instant delivery." },
        { icon: "📱", title: "Mini App storefront", desc: "Give buyers a full app-like storefront inside Telegram — browse, buy and re-download without leaving chat. Buyers can theme it their way: light or dark, their own background image, and a grid density that suits their screen. Silver plan and up." },
        { icon: "🧭", title: "Menu builder", desc: "Build custom navigation pages with buttons linking to your shop, forms, links or channels — no coding required." },
        { icon: "📝", title: "Forms", desc: "Create conversational, multi-step forms. Customers can pause and resume anytime, with a visible progress bar." },
        { icon: "💬", title: "Auto-replies", desc: "Set keyword-triggered replies so common questions get answered instantly, day or night." },
        { icon: "📣", title: "Broadcast", desc: "Send scheduled or one-off messages to your audience, with built-in cooldowns so you never look spammy." },
        { icon: "🎯", title: "Customer segments", desc: "Target broadcasts to specific groups — like your top spenders — instead of messaging everyone." },
        { icon: "🏷️", title: "Coupons", desc: "Create percentage or fixed discount codes, scoped to products or categories, with usage limits." },
        { icon: "🔒", title: "Channel-gated access", desc: "Require customers to join your channel(s) before they can use the bot — grow your channel while you sell." },
        { icon: "📦", title: "Channel-based storage", desc: "Products are stored in your private channel. We keep only message IDs — your files never sit on our servers." },
        { icon: "📊", title: "Dashboard & notifications", desc: "Track orders, revenue and audience growth inside the bot, and choose which events ping you." },
        { icon: "🔐", title: "Encrypted tokens", desc: "Bot tokens are encrypted at rest with Fernet. Nobody — including us — can read them in plain text." },
        { icon: "🎉", title: "Giveaways", desc: "Run join-to-enter giveaways with automatic winner picking and full entry analytics. Entrants can earn bonus entries by sharing your giveaway, turning every participant into a channel for reach — Gold plan and up." },
        { icon: "🗨️", title: "Live chat", desc: "Customers message you straight through the bot, with instant reply relay and owner-defined spam-keyword filtering." },
        { icon: "⚙️", title: "Automation & drip sequences", desc: "Fire welcome messages, coupons or credit rewards on join or purchase — or build multi-step drip sequences." },
        { icon: "🏆", title: "Achievements", desc: "Unlock badges as your store grows — always visible in your creator portfolio, even while the bot sleeps." },
        { icon: "🎁", title: "Referrals & Credits", desc: "Earn DigiHub Credits by referring other creators — spend them on upgrades or convert to customer credits." },
        { icon: "🌍", title: "23 languages, fully translated", desc: "Every screen, button and error message is translated across 23 languages — complete, not half-finished. New users pick their country and language on first launch, and pricing and text adapt automatically." },
        { icon: "🗣️", title: "Every buyer, their own language", desc: "Your customers each choose the language they read your store in, independently of the language you run the bot in — so one store serves a global audience properly." },
        { icon: "👥", title: "Team access", desc: "Delegate store management to trusted admins with granular, revocable, fully audited permissions." },
      ],

      steps: [
        { title: "Create your bot", desc: "Get a token from @BotFather and connect it to DigiHub." },
        { title: "Add your products", desc: "Forward files to your private storage channel and list them with a price in Stars." },
        { title: "Share your store", desc: "Drop your bot link in your channel or bio. Buyers browse with inline menus." },
        { title: "Get paid, auto-deliver", desc: "Stars arrive in your wallet, the file arrives in the buyer's chat. Done." },
      ],

      tiersNote: "Every new bot starts on a 12-day Elite trial — full top-tier features, no card needed. After that it drops to Free automatically, and Free just keeps running.",

      tiers: [
        { name: "Free",     price: "0",   unit: "⭐ / mo", tag: "",             perks: ["1 clone bot", "Up to 20 products", "Stars payments", "Stays online forever"] },
        { name: "Silver",   price: "100", unit: "⭐ / mo", tag: "",             perks: ["1 clone bot", "Up to 100 products", "Sales stats", "Mini App storefront"] },
        { name: "Gold",     price: "250", unit: "⭐ / mo", tag: "Most popular", perks: ["3 clone bots", "Up to 500 products", "Full dashboard", "Team access — up to 5 admins"] },
        { name: "Elite",    price: "500", unit: "⭐ / mo", tag: "",             perks: ["10 clone bots", "Unlimited products", "White-label — no DigiHub branding", "Team access — up to 20 admins"] },
        { name: "Business", price: "750", unit: "⭐ / mo", tag: "",             perks: ["10 clone bots", "Unlimited products", "6 force-join channels", "Team access — up to 50 admins"] },
      ],

      faq: [
        { q: "Do my files get uploaded to your servers?", a: "No. Files stay in a private Telegram channel that you own. DigiHub stores only the message ID and channel ID needed to forward the product after purchase." },
        { q: "What happens when my trial ends?", a: "Your bot doesn't stop. It automatically drops to the Free plan and keeps running — no products lost, no downtime. Upgrade anytime to unlock premium features again." },
        { q: "What happens if my paid subscription expires?", a: "Your store pauses gracefully — nothing is deleted. Renew any time and everything comes back exactly as you left it." },
        { q: "Can buyers spam my store bot?", a: "The bot UI is fully inline — buyers navigate with buttons and back-flows, and any text or tokens sent during setup are auto-deleted after use. Chats stay clean." },
        { q: "Which payment methods are supported?", a: "Telegram Stars, natively. Stars work in every country Telegram works in, with no card or gateway setup." },
      ],

      cta: {
        title: "Open your bot today",
        text: "Connect a bot token from @BotFather and get your first menu, form or product live in under five minutes — with a 12-day Elite trial included, no card needed.",
        btnLabel: "Launch DigiHub bot",
      },
    },
  },

  {
    id: "requestaccepter",
    name: "Request Accepter Pro",
    emoji: "✅",
    status: "live",
    short: "Auto-approve join requests with smart delays and captcha screening, welcome every member from your own branded bot, and run it all in 28 languages.",
    details: {
      botUsername: "@RequestAccepterPro_Bot",
      botLink: "https://t.me/RequestAccepterPro_Bot",
      eyebrow: "// Request Accepter Pro · live",
      headline: "Join requests, approved on autopilot.",
      sub: "Stop approving members by hand. Request Accepter Pro watches your private channels and groups, screens and approves join requests on your schedule, and welcomes every new member — from your own branded bot, in any of 28 languages.",
      ctaLabel: "Try it on Telegram",

      chat: {
        avatar: "✅",
        botName: "Request Accepter",
        messages: [
          { side: "in",  html: "🔔 <b>14 new join requests</b> in Deals Channel", time: "18:20" },
          { side: "in",  html: "✅ Approved all 14 with a 30–90 s smart delay.<br />Welcome message sent to each member.", time: "18:22",
            buttons: ["📊 Today's stats", "⚙️ Settings"] },
        ],
      },

      features: [
        { icon: "⚡", title: "Instant or delayed approval", desc: "Approve immediately, or hold requests behind a delay of up to 48 hours so growth looks organic and stays well inside Telegram's limits." },
        { icon: "🛡️", title: "Captcha screening", desc: "Make every requester tap a verify button before they're let in. Bots and drive-by joins never make it through, and you choose what happens to anyone who doesn't verify in time." },
        { icon: "🤖", title: "Your own clone bot", desc: "Connect a token from @BotFather and the approval bot runs under your brand, not ours — up to 3 bots on Pro, 8 on Diamond." },
        { icon: "📢", title: "Multiple channels & groups", desc: "One bot manages join requests across all your private channels and groups from a single dashboard." },
        { icon: "👋", title: "Welcome page builder", desc: "Design what every approved member sees: your own poster image, your text, and link buttons you lay out yourself — with colour styling and premium emoji icons on paid tiers." },
        { icon: "🔒", title: "Force-join channels", desc: "Require new members to join your other channels first — up to 2 on Pro and 4 on Diamond — so one channel's growth feeds the rest." },
        { icon: "📣", title: "Broadcast to members", desc: "Message everyone who joined through your bot, straight from the dashboard — no separate mailing tool needed." },
        { icon: "🌐", title: "28 languages", desc: "The whole bot speaks 28 languages, and the picker shows each one by its flag and its native name — so members choose in a language they can actually read." },
        { icon: "🚫", title: "Block troublesome users", desc: "Ban a specific user from your bot outright, and send a custom decline message to anyone you turn away." },
        { icon: "⏰", title: "Expiry reminders", desc: "Get told before your subscription lapses, so approvals never quietly stop in the middle of a growth push." },
        { icon: "📊", title: "Growth stats", desc: "See how many requests were approved today, this week and all-time — right inside the bot." },
        { icon: "🧹", title: "Zero spam setup", desc: "Fully inline setup flow. Tokens and setup messages are auto-deleted after use." },
      ],

      steps: [
        { title: "Create your bot", desc: "Get a token from @BotFather and connect it in one message." },
        { title: "Add it to your channel", desc: "Make your clone bot an admin with the 'Add members' right." },
        { title: "Pick a mode", desc: "Instant approval or smart randomized delays — your choice." },
        { title: "Relax", desc: "Requests get approved 24/7 and every member gets your welcome message." },
      ],

      tiersNote: "Every new owner gets a 28-day free trial — delays up to 48 hours included, no card needed. After that the Free plan keeps running with instant approval.",

      tiers: [
        { name: "Free",    price: "0",   unit: "⭐ / mo", tag: "",             perks: ["Instant approval", "Run from the main bot", "28-day free trial", "Growth stats"] },
        { name: "Pro",     price: "75",  unit: "⭐ / mo", tag: "Most popular", perks: ["3 clone bots", "Delays up to 24 hours", "Captcha screening", "2 force-join channels", "4 welcome buttons"] },
        { name: "Diamond", price: "150", unit: "⭐ / mo", tag: "",             perks: ["8 clone bots", "Delays up to 48 hours", "Captcha screening", "4 force-join channels", "8 welcome buttons"] },
      ],

      faq: [
        { q: "Is auto-approving allowed by Telegram?", a: "Yes — bots with admin rights can approve join requests via the official Bot API. Delays keep the pattern natural rather than approving hundreds of people in the same second." },
        { q: "Does the bot need access to my messages?", a: "No. It only needs the admin right to manage join requests in the channels you add it to." },
        { q: "Do I have to pay to try it?", a: "No. Every new owner gets a 28-day free trial including delays of up to 48 hours. When it ends nothing is deleted — you drop to the Free plan with instant approval and can upgrade whenever you want." },
        { q: "What does the captcha actually do?", a: "Before anyone is approved, the bot asks them to tap a verify button. They get five minutes to do it, and you decide what happens to people who never verify — so automated join floods don't reach your channel." },
        { q: "Can I run more than one channel?", a: "Yes. One bot handles join requests across all your private channels and groups. Paid tiers also let you run several clone bots — 3 on Pro, 8 on Diamond — each under its own brand." },
        { q: "Which languages does it support?", a: "28, including Arabic, Bengali, Burmese, Farsi, Hebrew, Hindi, Indonesian, Japanese, Korean, Thai, Urdu, Vietnamese and both Simplified and Traditional Chinese. Members pick their own from a list showing each language's flag and native name." },
      ],

      cta: {
        title: "Approve your next 1,000 members automatically",
        text: "Set up takes about a minute. Connect a token, add the bot to your channel, done.",
        btnLabel: "Start on Telegram",
      },
    },
  },

  {
    id: "flashprepareai",
    name: "FlashPrepareAI",
    emoji: "🎓",
    status: "live",
    short: "AI interview preparation for students — mock interviews, coding practice and coaching that actually knows your resume. Billed by the minute, not by subscription.",
    details: {
      botLink: "https://flashprepareai.digihubhmax.com",
      linkLabel: "Open FlashPrepareAI",
      eyebrow: "// FlashPrepareAI · live",
      headline: "Practise the interview before you sit it.",
      sub: "FlashPrepareAI is a preparation tool. Run mock interviews, work through coding and system-design questions, and get coaching that reads from your real resume instead of inventing a career for you. Practice mode only — it is built for getting ready, not for use during a live interview.",
      ctaLabel: "Open FlashPrepareAI",

      chat: {
        avatar: "🎓",
        botName: "FlashPrepareAI",
        messages: [
          { side: "out", html: "Explain database indexing like you are asking me in an interview", time: "20:14" },
          { side: "in",  html: "📚 <b>Deep-dive mode</b><br />Let us start where an interviewer would: <i>what problem does an index actually solve?</i>", time: "20:14",
            buttons: ["Answer out loud", "Show model answer"] },
          { side: "out", html: "It speeds up lookups so you do not scan every row", time: "20:15" },
          { side: "in",  html: "✅ Right idea. Now tighten it — name the data structure and the write cost.<br /><span class='star'>Calibrated to: 2 yrs experience</span>", time: "20:15" },
        ],
      },

      features: [
        { icon: "🎯", title: "Answers shaped by question type", desc: "A coding question, a deep-dive design question, a definition, a syntax lookup and a SQL query each need a different answer. The tool detects which one you asked and responds in that shape." },
        { icon: "📄", title: "Coaching from your real resume", desc: "Attach your resume and answers are grounded in your actual projects and history. With no resume attached it refuses to invent one — no fabricated projects to get caught out on." },
        { icon: "📏", title: "Calibrated to your experience", desc: "A fresher and someone with five years in should not get the same answer. Set your level and the depth, vocabulary and expectations move with it." },
        { icon: "💻", title: "Coding and deep-dive practice", desc: "Work through coding problems and system-design questions with follow-ups that push on the parts an interviewer would actually probe." },
        { icon: "☕", title: "Version-aware for Java", desc: "Answers know which Java version you are targeting, so you do not rehearse an approach that your interviewer stack does not support." },
        { icon: "📱", title: "Android app", desc: "Practise from your phone with the companion Android app, including a paired second-device mode for hands-free sessions." },
        { icon: "⏱️", title: "Pay by the minute", desc: "No monthly subscription. You are billed for the minutes you actually practise, so a short revision session costs like a short revision session." },
        { icon: "🎁", title: "Referrals", desc: "Invite classmates and earn practice credit — useful when a whole batch is preparing for the same placement season." },
      ],

      steps: [
        { title: "Sign in", desc: "Create an account at flashprepareai.digihubhmax.com — no card needed to look around." },
        { title: "Attach your resume", desc: "Optional, but it is what turns generic answers into answers about your own projects." },
        { title: "Pick your level and mode", desc: "Set your experience level, then practise coding, deep-dive, SQL or rapid definitions." },
        { title: "Practise out loud", desc: "Answer, get corrected, and go again — with session feedback at the end." },
      ],

      tiers: [],   // per-minute billing, not tiers — section auto-hides

      faq: [
        { q: "Is this for use during a real interview?", a: "No. FlashPrepareAI is a practice and preparation tool, and that is the only way it is meant to be used. Use it to get ready beforehand." },
        { q: "How does billing work?", a: "Per minute of practice, rather than a monthly plan. You top up and spend it on the sessions you actually run." },
        { q: "What happens if I do not attach a resume?", a: "It will still coach you, but it will not pretend to know your background. It is built to refuse to invent projects or experience you never had." },
        { q: "Is there a mobile version?", a: "Yes — an Android app, with a paired-device mode so you can practise hands-free." },
      ],

      cta: {
        title: "Start practising tonight",
        text: "Set your experience level, attach your resume and run your first mock interview in a few minutes.",
        btnLabel: "Open FlashPrepareAI",
      },
    },
  },

  {
    id: "mediakit",
    name: "Media Kit Builder",
    emoji: "📸",
    status: "live",
    short: "Build the Instagram media kit and rate card brands ask for — enter your numbers, pick a theme, export a polished PDF.",
    details: {
      botLink: "https://digihubhmax.com/media-kit.html",
      linkLabel: "Open the builder",
      eyebrow: "// Media Kit Builder · live",
      headline: "The rate card brands ask for, built in minutes.",
      sub: "Every brand deal starts with the same request: send us your media kit. This builds one — your audience numbers, who follows you, what you charge and your payment terms — and exports it as a clean page you can send straight back. No design tool, no template hunting.",
      ctaLabel: "Open the builder",

      features: [
        { icon: "📈", title: "Your real numbers, laid out properly", desc: "Followers, engagement rate, average reel views, story views, likes and comments — presented the way a brand marketing team expects to read them." },
        { icon: "👥", title: "Audience breakdown", desc: "Gender split, main age range and top locations, so a brand can see at a glance whether your audience is the one they are trying to reach." },
        { icon: "💰", title: "Rate card and terms", desc: "Set your rate per 1,000 followers in your own currency, and spell out payment terms — like 50% advance, balance within 15 days of going live — so the awkward conversation is already handled." },
        { icon: "🤝", title: "Brands you have worked with", desc: "List past collaborations to build credibility with the brand reading it." },
        { icon: "🎨", title: "Make it look like you", desc: "Choose a card theme, accent colour and font, drop in your own background image and tune its blur, and set text colour for legibility over any photo." },
        { icon: "📥", title: "Export and send", desc: "Render the finished kit and download it, ready to attach to an email or DM. Nothing to install." },
      ],

      steps: [
        { title: "Open the builder", desc: "It runs in the browser — phone or laptop, no app to install." },
        { title: "Fill in your numbers", desc: "Handle, followers, engagement and the audience breakdown from your Instagram insights." },
        { title: "Set your rates", desc: "Rate per 1,000 followers, currency and the payment terms you work on." },
        { title: "Style it and export", desc: "Pick a theme and background, then download your finished media kit." },
      ],

      tiers: [],   // free tool — section auto-hides

      faq: [
        { q: "Do I need a design tool?", a: "No. You fill in a form and the layout is done for you — theme, colours, fonts and background are all pickers." },
        { q: "What do I actually get at the end?", a: "A finished media kit page you can render and download, covering your audience stats, demographics, past brand work and your rate card." },
        { q: "Does it work on a phone?", a: "Yes — it is built mobile-first and can be added to your home screen like an app." },
      ],

      cta: {
        title: "Stop rebuilding your media kit from scratch",
        text: "Enter your numbers once, style it your way, and export a rate card you can send to the next brand that asks.",
        btnLabel: "Open the builder",
      },
    },
  },

  {
    id: "groupmanager",
    name: "Group Manager",
    emoji: "🛡️",
    status: "soon",
    short: "Full-power group moderation — bans, warns, auto-actions and admin tools built for groups with millions of members.",
    /* no `details` → card shows without a link. Add details later
       and the page + nav link appear automatically. */
  },
];

/* ============================================================
   LEGAL — every object here becomes a page at
   legal.html?doc=<id> and is linked automatically in the footer.

   Each section: { h: "heading", body: [ ...items ] }
   where an item is either a plain string (one paragraph)
   or { list: ["point 1", "point 2"] } for bullet points.

   To add ANY new document (refund policy, DMCA, etc.) just
   copy one of these objects and change id / title / sections.
   ============================================================ */
const LEGAL = [
  {
    id: "privacy",
    title: "Privacy Policy",
    updated: "July 16, 2026",
    intro: "This Privacy Policy explains what information DiGiHub collects when you use our Telegram bots (including DigiHub, Request Accepter Pro and any clone bots created through them), how we use it, and the choices you have.",
    sections: [
      {
        h: "1. Who we are",
        body: [
          "DiGiHub builds and operates Telegram bot platforms. Our services run entirely inside Telegram — we have no mobile app or account system of our own.",
          "DiGiHub is an independent project and is not affiliated with, endorsed by, or sponsored by Telegram FZ-LLC.",
        ],
      },
      {
        h: "2. Cookies and tracking",
        body: [
          "This website does not use cookies, analytics scripts or advertising trackers of any kind.",
          "Our bots have no web dashboard either — every feature runs inside Telegram chat, so there is nothing outside Telegram that could set a cookie or track you across sites.",
        ],
      },
      {
        h: "3. Information we collect",
        body: [
          "When you interact with our bots, we collect and store:",
          { list: [
            "Your Telegram user ID, username and first name (provided by Telegram with every message).",
            "Bot tokens you connect to create a clone bot. Tokens are encrypted at rest and are never shown or shared in plain text.",
            "Content you create with the bot's modules: product listings, custom menus, form questions and answers, auto-reply keywords, coupon codes, and broadcast messages.",
            "Order and payment records: which product was bought, when, for how many Stars, and the Telegram payment identifiers needed for delivery and support.",
            "Basic usage data such as which menus you open, used to keep the bots reliable and to debug problems.",
          ]},
        ],
      },
      {
        h: "4. What we do NOT collect",
        body: [
          { list: [
            "Your files. Products stay in a private Telegram channel that you own. We store only the message ID and channel ID needed to forward a product after purchase.",
            "Your phone number, email address or contact list — Telegram does not share these with bots.",
            "Card numbers or bank details. Payments in Telegram Stars are processed entirely by Telegram.",
            "Message history outside the bot chat. Our bots only see messages sent directly to them.",
          ]},
        ],
      },
      {
        h: "5. Legal basis for processing",
        body: [
          "We process the data above because it's necessary to provide the service you've asked for — running your bot, delivering products, and keeping accounts secure — which counts as our legitimate interest in operating the platform you signed up to use.",
          "Where we rely on payment processing or fraud prevention, that's necessary to fulfil our side of the transaction and to comply with our own legal obligations.",
        ],
      },
      {
        h: "6. How we use your information",
        body: [
          { list: [
            "To run the service: deliver products, power your bot's menus, forms, broadcasts and other modules, and enforce plan limits.",
            "To process payments and keep records of orders for support and dispute resolution.",
            "To send you service messages inside Telegram (order confirmations, subscription reminders).",
            "To prevent abuse, fraud and violations of our Terms & Conditions.",
          ]},
          "We do not sell your data, show ads, or share your information with third parties for marketing.",
        ],
      },
      {
        h: "7. Storage and security",
        body: [
          "Data is stored in a PostgreSQL database on our own servers — we don't use a named third-party cloud data platform. Clone bot tokens are encrypted at rest using Fernet symmetric encryption; nobody — including our team — can read them in plain text.",
          "Files and screenshots live inside Telegram's own infrastructure (private channels), protected by Telegram's security. Access to our database and admin channels is restricted to the project administrators.",
          "Found a security vulnerability? Please report it to security@digihubhmax.com rather than disclosing it publicly — we take these reports seriously and will respond promptly.",
        ],
      },
      {
        h: "8. Third parties",
        body: [
          "Our services are built on the official Telegram Bot API, so all activity also falls under Telegram's own Privacy Policy and Terms of Service.",
          "Payments in Telegram Stars are handled by Telegram. We do not receive access to your bank or card details.",
        ],
      },
      {
        h: "9. Data retention and deletion",
        body: [
          "We keep your account and store data for as long as you use the service. If your subscription expires, your data is kept so you can resume where you left off.",
          "Internal system logs (automation logs, health alerts, admin audit trail) are purged automatically on a rolling basis, typically within 30–90 days, and are not user-facing data.",
          "You can request deletion of your account data (store, products metadata, clone bot tokens) at any time by contacting us on Telegram or emailing privacy@digihubhmax.com. We will delete it within 30 days, except records we must keep for fraud prevention or legal reasons.",
        ],
      },
      {
        h: "10. Your rights",
        body: [
          "Whoever you are and wherever you're contacting us from, you can ask us at any time to:",
          { list: [
            "Access a copy of the personal data we hold about you.",
            "Correct any of it that's inaccurate or out of date.",
            "Delete your data, as described in the section above.",
            "Object to a specific use of your data that isn't necessary to run the service.",
          ]},
          "Send these requests on Telegram or to privacy@digihubhmax.com and we'll respond within 30 days.",
        ],
      },
      {
        h: "11. Children",
        body: [
          "Our services are not directed at children under 13 (or the minimum age required by Telegram in your country). We do not knowingly collect data from children.",
        ],
      },
      {
        h: "12. Changes to this policy",
        body: [
          "We may update this policy as the service evolves. The 'Last updated' date at the top always reflects the current version. Significant changes will be announced in our Telegram channel.",
        ],
      },
      {
        h: "13. Contact",
        body: [
          "Questions about privacy, or want to exercise any of the rights above? Message us on Telegram, or email privacy@digihubhmax.com. Security vulnerability reports go to security@digihubhmax.com instead.",
        ],
      },
    ],
  },

  {
    id: "terms",
    title: "Terms & Conditions",
    updated: "July 16, 2026",
    intro: "These Terms & Conditions govern your use of DiGiHub's Telegram bots and platforms, including DigiHub, Request Accepter Pro, and any clone bot you create through them. By using our bots you agree to these terms.",
    sections: [
      {
        h: "1. The service",
        body: [
          "DiGiHub provides multi-tenant Telegram bot platforms: tools that let you run your own storefront bot, join-request approval bot, and related automation, using a bot token that you own.",
          "DiGiHub is an independent project and is not affiliated with Telegram FZ-LLC. You must also comply with Telegram's Terms of Service and Bot API terms at all times.",
        ],
      },
      {
        h: "2. Eligibility and your account",
        body: [
          { list: [
            "You need a valid Telegram account to use the service.",
            "Your 'account' with us is identified by your Telegram user ID. You are responsible for everything done through your account and your clone bots.",
            "You must be legally able to enter into these terms in your country.",
          ]},
        ],
      },
      {
        h: "3. Clone bots and your responsibilities",
        body: [
          "When you connect a bot token, the resulting clone bot runs under your name and brand. You are the operator of that bot and are responsible for:",
          { list: [
            "The products, files and content you sell or distribute through it.",
            "Having the legal right to sell that content (you own it or hold a licence).",
            "How you describe products to buyers, your pricing, and your own buyer support.",
            "Keeping your bot token secure and revoking it via @BotFather if you believe it is compromised.",
          ]},
        ],
      },
      {
        h: "4. Prohibited use",
        body: [
          "You may not use the platform to sell, store or distribute:",
          { list: [
            "Pirated or copyright-infringing content (courses, software, movies, e-books you don't have rights to).",
            "Illegal goods or services, malware, stolen data, or hacking tools intended for unauthorized access.",
            "Content that violates Telegram's Terms of Service, including spam or artificially inflating channels.",
            "Anything involving minors in a harmful or sexual context — this results in an immediate permanent ban and a report to Telegram.",
          ]},
          "We may suspend or remove any store, product or clone bot that we reasonably believe violates this section, without prior notice.",
        ],
      },
      {
        h: "5. Payments, subscriptions and plans",
        body: [
          { list: [
            "Paid plans are billed in Telegram Stars for the period shown at purchase.",
            "Plan limits (number of clone bots, number of products, features) are enforced automatically.",
            "If your subscription expires, your store pauses gracefully — nothing is deleted, and renewing restores everything.",
            "Prices may change; changes apply from your next renewal, never retroactively.",
          ]},
          "Billing or payment issues? Email billing@digihubhmax.com.",
        ],
      },
      {
        h: "6. Refunds",
        body: [
          "Subscription payments are generally non-refundable once the plan period has started, because the service is delivered digitally and immediately.",
          "If a technical fault on our side prevented you from using a paid feature, contact support — we will fix the issue, extend your plan, or refund at our discretion.",
          "Sales made through your clone bot are between you and your buyer. You set your own refund policy for your products; DiGiHub is not a party to those transactions.",
        ],
      },
      {
        h: "7. Your content and our platform",
        body: [
          "You keep full ownership of your products and files — they remain in your private Telegram channel. We store only the metadata (message IDs, titles, prices) needed to run your store.",
          "The DiGiHub platform, bots, code and branding remain our property. You get a personal, non-transferable right to use the service while these terms are respected.",
        ],
      },
      {
        h: "8. Service availability",
        body: [
          "The service is provided 'as is' and 'as available'. We work hard to keep the bots online 24/7, but we do not guarantee uninterrupted operation — Telegram outages, server maintenance and technical failures can cause downtime.",
          "We may add, change or discontinue features at any time. Material changes will be announced in our Telegram channel.",
        ],
      },
      {
        h: "9. Limitation of liability",
        body: [
          "To the maximum extent permitted by law, DiGiHub is not liable for indirect damages, lost profits, or lost sales arising from use of the service. Our total liability for any claim is limited to the amount you paid us in the 3 months before the claim.",
        ],
      },
      {
        h: "10. Termination",
        body: [
          "You can stop using the service at any time and request deletion of your data (see the Privacy Policy).",
          "We may suspend or terminate accounts that violate these terms. For serious violations (Section 4), termination can be immediate and without refund.",
        ],
      },
      {
        h: "11. Changes to these terms",
        body: [
          "We may update these terms as the service evolves. The 'Last updated' date reflects the current version. Continuing to use the bots after changes means you accept the updated terms.",
        ],
      },
      {
        h: "12. Contact",
        body: [
          "Questions about these terms, contracts or compliance? Reach us on Telegram or email legal@digihubhmax.com. For general questions, contact@digihubhmax.com works too.",
        ],
      },
    ],
  },
];

/* ============================================================
   GUIDES — one entry per bot module, each becomes a Help-Center-
   style page at guide.html?module=<id>, linked from the "Guide"
   button inside that module in the bot itself.

   Every entry needs: id, title, icon, summary (shown at the top
   of the page and used as the module's one-line description).

   media (optional): { type: "image"|"video", src: "..." } — a
   screenshot or short clip shown right under the summary. Leave
   as `media: null` and the page simply skips it — no empty box,
   the layout just flows straight to Quick Answers. Set it by hand
   (a path under assets/img/) or upload one through the admin
   panel's Guides tab, which embeds it directly into this file —
   keep uploads small (a few hundred KB), especially for video.

   quickAnswers (optional): the actual point of this page — a list
   of {q, a} pairs rendered as a click-to-expand FAQ, same pattern
   as the project pages' pricing FAQ. Keep answers to 1-2 sentences;
   this is for someone who needs the answer in the next 30 seconds,
   not a manual.

   sections (optional): longer-form documentation, same {h, body}
   shape as LEGAL above, for anyone who wants more depth than Quick
   Answers gives. Leave both quickAnswers and sections empty and
   the page shows "Full guide coming soon" instead.
   ============================================================ */
const GUIDES = [
  { id: "shop", title: "Shop Guide", icon: "🛍️",
    summary: "Sell digital products with Telegram Stars. Products stay in your private storage channel — buyers get instant delivery after payment.",
    media: null,
    quickAnswers: [
      { q: "How do customers find my shop?", a: "Add a button linking to your shop from your Welcome page or a menu — customers tap it to browse." },
      { q: "Where are my product files stored?", a: "Inside your own private Telegram storage channel. DigiHub only keeps the message ID — never a copy of the file itself." },
      { q: "Can I organize products into categories?", a: "Yes — add categories from Categories, then assign each product to one. No categories means customers see a flat product list." },
    ],
    sections: [
      { h: "Setting up your shop", body: [
        { list: [
          "Connect a private storage channel — the bot needs to be an admin there. This is where every product file actually lives.",
          "Add at least one category (optional, but customers browse by category once you have more than a couple of products).",
          "Create a product: name, price in Telegram Stars, and the file itself (or a link, for non-file products).",
          "Set the product's Reward — what a buyer actually receives. A product with no reward set stays invisible to customers and can't be purchased.",
        ] },
      ] },
      { h: "The Showcase page", body: [
        "When you mark a product for the Showcase, it becomes the first page customers see when they open your store — useful for featuring your best or newest item instead of making customers scroll a full catalog.",
        { type: "tip", text: "Priority controls ordering within a category or the Showcase — higher priority products appear first." },
      ] },
      { h: "Discounts and delivery", body: [
        "Coupons (percentage or fixed) and any customer credit balance both apply at checkout, coupon first — see the Coupons guide for how to scope one to a specific product.",
        "Delivery is instant and automatic: once Stars payment clears, the buyer gets the file directly, copied straight from your storage channel.",
      ] },
    ] },
  { id: "giveaways", title: "Giveaways Guide", icon: "🎉",
    summary: "Run join-to-enter giveaways with automatic winner picking, entry tracking, and full analytics.",
    media: null,
    quickAnswers: [
      { q: "How are winners picked?", a: "Automatically and randomly from everyone who met the entry conditions when the giveaway ends." },
      { q: "Can I require customers to join a channel to enter?", a: "Yes — set join conditions when you create the giveaway." },
      { q: "How is the reward delivered?", a: "Automatically, to each winner, the moment the giveaway ends — no manual step needed." },
    ],
    sections: [
      { h: "Creating a giveaway", body: [
        { list: [
          "Set a title, a banner image, and the prize each winner receives.",
          "Choose an end time — entries close automatically the moment it's reached.",
          "Optionally require entrants to join one or more channels first, the same gate Force Join uses.",
        ] },
      ] },
      { h: "Entries and winners", body: [
        "Every entrant is tracked automatically, so you always know exactly how many people are in. When the giveaway ends, winners are picked at random from everyone who met the entry conditions at that moment, and rewards go out immediately — no manual step, no risk of forgetting.",
        { type: "note", text: "A customer who joins the required channel(s) after the giveaway already ended is not retroactively entered — the conditions are checked at entry time, not at draw time." },
      ] },
      { h: "Analytics", body: [
        "Each giveaway's detail screen shows entry count over time and, after it ends, the winner list — useful for judging whether a prize tier is actually driving entries before you run another one.",
      ] },
    ] },
  { id: "forms", title: "Forms Guide", icon: "📝",
    summary: "Build conversational, multi-step forms. Customers can pause and resume anytime, with a visible progress bar.",
    media: null,
    quickAnswers: [
      { q: "Can customers pause and come back later?", a: "Yes — forms save progress automatically, with a visible progress bar." },
      { q: "Where do submitted answers go?", a: "You get a notification with all their answers in one view the moment they submit." },
      { q: "What happens after someone submits?", a: "You can optionally route them to a specific menu or page once they finish." },
    ],
    sections: [
      { h: "Building a form", body: [
        "Give it a title and description, then add questions one at a time — each can be plain text, multiple choice, or a few other answer types, and you choose per question whether it's required.",
        { type: "tip", text: "Reorder or temporarily disable individual questions any time without losing the ones customers already answered." },
      ] },
      { h: "The customer experience", body: [
        "Questions are asked one at a time in a real conversation, not a wall of fields — a visible progress bar shows how far along they are. If a customer closes the chat mid-form, their answers so far are saved; they pick up exactly where they left off next time.",
      ] },
      { h: "Reviewing submissions", body: [
        "Every submission arrives as a single notification with all answers laid out together. From there you can optionally route the customer straight into a specific menu or page once they finish, useful for a form that gates access to something.",
      ] },
    ] },
  { id: "broadcast", title: "Broadcast Guide", icon: "📣",
    summary: "Send scheduled or one-off messages to your audience, with built-in cooldowns and customer-segment targeting.",
    media: null,
    quickAnswers: [
      { q: "Who can I send a broadcast to?", a: "Everyone, or a specific segment — new customers, buyers, high spenders, inactive users, and more." },
      { q: "Is there a cooldown between broadcasts?", a: "Yes, scaled to your plan — the panel shows exactly when you can send your next one." },
      { q: "Can I test before sending to everyone?", a: "Yes — Test First sends it only to you before it goes out to real customers." },
    ],
    sections: [
      { h: "Composing a broadcast", body: [
        "Add text, media, and buttons (the same Universal Button Builder used across DigiHub) before you send. Test First delivers the exact message to you alone, so you catch a typo or a broken link before your whole audience sees it.",
      ] },
      { h: "Targeting a segment", body: [
        "Send to everyone, or narrow it to a segment — new customers, buyers, high spenders, or people who haven't been back in a while. Segments are built from real purchase and activity data, not a list you maintain manually.",
      ] },
      { h: "Send cooldowns", body: [
        { type: "warning", text: "There's a minimum gap between broadcasts, scaled to your plan — the composer shows exactly when your next send is allowed. This isn't arbitrary: pacing sends is also what keeps Telegram from treating your bot as a spam source." },
      ] },
    ] },
  { id: "automation", title: "Automation Guide", icon: "⚙️",
    summary: "Trigger welcome messages, coupons, or credit rewards automatically when a customer joins or buys — or build multi-step drip sequences that run on their own.",
    media: null,
    quickAnswers: [
      { q: "What can trigger a rule?", a: "A customer joining your bot or completing a purchase — set once, it runs on its own from then on." },
      { q: "What's the difference between Automation and Sequences?", a: "Rules fire once per trigger. Sequences (drip campaigns) send a series of steps over time after the trigger." },
      { q: "Can I delay an action?", a: "Yes — immediately, after a set time (15 min / 1 hour / 24 hours), or a custom delay." },
    ],
    sections: [
      { h: "Rules vs. Sequences", body: [
        "A Rule fires once, right when its trigger happens — a customer joining, or completing a purchase. A Sequence is a multi-step drip campaign that keeps running over time after that same kind of trigger: welcome message now, a tip after a day, a coupon after a week, and so on.",
      ] },
      { h: "Building a rule", body: [
        { list: [
          "Pick the trigger: join, or purchase.",
          "Pick the action: send a message, grant a coupon, or credit customer wallet balance.",
          "Pick the delay: immediately, a preset window (15 min / 1 hour / 24 hours), or a custom delay you set yourself.",
        ] },
      ] },
      { h: "Sequences", body: [
        { type: "tip", text: "Use a Sequence when you want a relationship to build over several touches instead of one action — a welcome series is the most common use, but reward or win-back sequences work the same way." },
      ] },
    ] },
  { id: "force_join", title: "Force Join Guide", icon: "🔒",
    summary: "Require customers to join your channel(s) before they can use the bot.",
    media: null,
    quickAnswers: [
      { q: "What happens if a customer hasn't joined?", a: "They see a gate asking them to join before they can use the bot — it re-checks automatically once they do." },
      { q: "How many channels can I require?", a: "Depends on your plan — the panel shows your current usage and limit." },
      { q: "Does this affect me, the owner?", a: "No — the gate only applies to customers, never to you." },
    ],
    sections: [
      { h: "Setting it up", body: [
        "Add one or more channels a customer must join before they can use your bot. The bot needs to be an admin in each channel to actually check membership.",
      ] },
      { h: "What customers see", body: [
        "Anyone who hasn't joined gets a gate screen with a join button instead of the bot's normal menus. The check re-runs automatically the moment they tap through and join — no need for them to come back and retry manually.",
        { type: "note", text: "The gate applies to customers only. You and any delegated admins pass straight through regardless of channel membership." },
      ] },
      { h: "Plan limits", body: [
        "How many channels you can require is scaled to your plan — the panel always shows your current usage against that limit.",
      ] },
    ] },
  { id: "menu_builder", title: "Menu Builder Guide", icon: "🧭",
    summary: "Build custom navigation pages with buttons linking to your shop, forms, links, or channels — no coding required.",
    media: null,
    quickAnswers: [
      { q: "What can a menu link to?", a: "Your shop, forms, external links, or channels — buttons you place yourself, no coding needed." },
      { q: "Can I set a menu as my bot's homepage?", a: "Yes — set any menu as Home, and it's what customers see when they open your bot." },
      { q: "Is there a limit on menus?", a: "Yes, scaled to your plan — the panel shows how many you've used." },
    ],
    sections: [
      { h: "The Home Menu", body: [
        "One menu is always your Home Menu — it's what customers land on the moment they open your bot, unless you've customized the Welcome Page separately. Set any menu as Home from its detail card at any time; the previous one is automatically unset.",
      ] },
      { h: "Building a menu", body: [
        "Start with just a title — description, media, and buttons are all optional fields you fill in whenever you're ready, not a forced step-by-step wizard. Buttons go through the same Universal Button Builder used by Welcome and Broadcast: move, duplicate, recolor, and pick where each one links.",
      ] },
      { h: "Templates and duplication", body: [
        { list: [
          "Six ready-made templates cover common needs — Rules & Terms, FAQ, VIP Benefits, Support Center, and Application Portal, alongside a blank Home template.",
          "Duplicate an existing menu (content and buttons both) as a faster starting point than a template when you're making something similar to what you already have.",
        ] },
      ] },
    ] },
  { id: "auto_replies", title: "Auto Replies Guide", icon: "💬",
    summary: "Set keyword-triggered replies so common questions get answered instantly, day or night.",
    media: null,
    quickAnswers: [
      { q: "How does DigiHub decide which reply to send?", a: "Whichever rule's trigger text matches what the customer typed — exact or partial match, your choice per rule." },
      { q: "Can I turn a reply off without deleting it?", a: "Yes — tap the toggle next to any rule to disable it temporarily." },
      { q: "Is there a limit on rules?", a: "Yes, scaled to your plan." },
    ],
    sections: [
      { h: "How matching works", body: [
        "Each rule has a trigger phrase and a reply. Choose per rule whether it matches only an exact message or any message containing that text — exact match for precise commands, partial match for catching variations of the same question.",
      ] },
      { h: "Managing rules", body: [
        { type: "tip", text: "Toggle a rule off instead of deleting it if you just want to pause it temporarily — the trigger and reply stay saved, ready to re-enable later." },
      ] },
      { h: "How it fits with Live Chat", body: [
        "Auto Replies is checked first on every incoming customer message. Only when nothing matches does the message fall through to Live Chat (if you have it turned on) and reach you directly.",
      ] },
    ] },
  { id: "live_chat", title: "Live Chat Guide", icon: "🗨️",
    summary: "Let customers message you directly through the bot — replies relay back instantly, with owner-defined keyword filtering to block spam.",
    media: null,
    quickAnswers: [
      { q: "What happens when a customer messages me?", a: "It's relayed to you directly, and your reply gets relayed back to them. Off by default, so nothing changes until you turn it on." },
      { q: "Can I block spam messages?", a: "Yes — set a keyword filter. Matching messages never reach you, and the customer gets a quiet notice instead." },
      { q: "Does this replace Auto Replies?", a: "No — a customer who triggers an Auto Reply still just gets that reply. Live Chat is for everything else." },
    ],
    sections: [
      { h: "Turning it on", body: [
        "Off by default — nothing about your bot's behavior changes until you flip it on. Once enabled, any customer message that doesn't match an Auto Reply gets relayed straight to you.",
      ] },
      { h: "Replying", body: [
        "Reply the same way you would to any Telegram message: long-press it and hit Reply. No commands, no separate inbox screen — your reply is relayed back to that exact customer automatically.",
      ] },
      { h: "Keeping out spam", body: [
        { type: "tip", text: "Set a keyword filter to block specific words or phrases before they ever reach you. A matching message never gets relayed — the customer gets a short, quiet notice instead." },
      ] },
    ] },
  { id: "coupons", title: "Coupons Guide", icon: "🏷️",
    summary: "Create percentage or fixed discount codes, scoped to products or categories, with usage limits.",
    media: null,
    quickAnswers: [
      { q: "Can a coupon apply to just one product?", a: "Yes — scope it to a specific product or category, or leave it store-wide." },
      { q: "Can I limit how many times a coupon is used?", a: "Yes — set a usage limit per coupon when you create it." },
      { q: "Percentage or fixed discount?", a: "Either — choose when you create the coupon." },
    ],
    sections: [
      { h: "Creating a coupon", body: [
        { list: [
          "Choose a code, and whether the discount is a percentage or a fixed Stars amount.",
          "Scope it — store-wide, or limited to one product or category.",
          "Set an optional usage limit so it stops working once redeemed that many times.",
        ] },
      ] },
      { h: "How discounts apply", body: [
        "A coupon applies first at checkout, then any customer credit balance on top of that — so the two stack rather than one overriding the other.",
      ] },
    ] },
  { id: "credits", title: "Credits Guide", icon: "💎",
    summary: "DigiHub Credits cover your per-sale commission — recharge to keep your store online.",
    media: null,
    quickAnswers: [
      { q: "What are Credits actually for?", a: "They cover your per-sale commission — each sale draws from your balance, so your store keeps running as long as you have Credits." },
      { q: "What happens if I run out?", a: "Recharge to keep your store online — the panel shows your balance and roughly how many more sales it covers." },
      { q: "Where do I buy more?", a: "Tap Buy Credits — purchases happen in the main DigiHub bot." },
    ],
    sections: [
      { h: "What Credits fund", body: [
        "DigiHub takes a small commission on each sale your store makes, and Credits are what cover it — every sale draws automatically from your balance. Your store keeps operating normally as long as you have enough.",
      ] },
      { h: "Running low", body: [
        { type: "warning", text: "If your balance runs out, new sales can't complete until you recharge — existing customers and orders aren't affected, but checkout pauses until Credits are topped up." },
      ] },
      { h: "Recharging", body: [
        "Tap Buy Credits from the panel — purchases happen inside the main DigiHub bot itself, in Telegram Stars, and land in your balance instantly.",
      ] },
    ] },
  { id: "welcome", title: "Welcome Page Guide", icon: "👋",
    summary: "The first thing customers see when they open your bot — your poster, message, and navigation buttons.",
    media: null,
    quickAnswers: [
      { q: "What shows up here?", a: "Whatever a customer sees the moment they open your bot — your poster image, message text, and navigation buttons." },
      { q: "Can I preview it before customers see it?", a: "Yes — tap Preview to see exactly what they'll see." },
      { q: "What if I don't set anything?", a: "DigiHub shows a sensible default until you customize it." },
    ],
    sections: [
      { h: "What goes here", body: [
        "A poster image or video, a message (with full rich-text formatting — bold, italic, links, and premium emoji if you have Telegram Premium yourself), and navigation buttons through the same Universal Button Builder used elsewhere.",
      ] },
      { h: "Before you publish", body: [
        { type: "tip", text: "Tap Preview any time to see exactly what a customer sees — it renders through the same function real customers hit, so there's never a gap between preview and reality." },
      ] },
      { h: "Personalization", body: [
        "Leave the message unset and DigiHub shows a default greeting personalized with each customer's own name. The moment you set custom text, it's shown to everyone exactly as you wrote it — personalization only applies to the default.",
      ] },
    ] },
  { id: "referrals", title: "Referrals Guide", icon: "🎁",
    summary: "Earn DigiHub Credits by referring other creators, with rewards across three tiers.",
    media: null,
    quickAnswers: [
      { q: "How do I earn Credits?", a: "Share your referral link — when another creator subscribes to a paid plan, you earn a percentage automatically." },
      { q: "How many tiers are there?", a: "Three — you earn from people you refer directly, and smaller rewards from the tiers below them." },
      { q: "What can I do with earned Credits?", a: "Use them to upgrade or renew your own subscription, or convert them into customer credits inside one of your stores." },
    ],
    sections: [
      { h: "How the three tiers work", body: [
        "You earn a percentage when someone you referred directly subscribes to a paid plan — that's tier one. Smaller rewards flow up from the people they in turn refer (tier two), and again one level below that (tier three). All of it is automatic once you've shared your link.",
      ] },
      { h: "Using what you earn", body: [
        { list: [
          "Apply earned Credits toward upgrading or renewing your own subscription.",
          "Or convert them into customer credits inside one of your own stores, to fund promotions or rewards for your buyers.",
        ] },
      ] },
    ] },
  { id: "subscriptions", title: "Plans & Subscription Guide", icon: "💎",
    summary: "Compare DigiHub plans, upgrade, and renew — pricing is in Telegram Stars, billed for the period you choose.",
    media: null,
    quickAnswers: [
      { q: "What does upgrading actually unlock?", a: "More bots, more products, and higher-tier tools like analytics, automation, and white-label — each plan's card shows exactly what's included." },
      { q: "What happens if my plan expires?", a: "Your store pauses gracefully — nothing is deleted, and renewing restores everything exactly as it was." },
      { q: "How is pricing billed?", a: "In Telegram Stars, for whichever period you choose — discounts apply automatically for longer commitments." },
    ],
    sections: [
      { h: "Choosing a plan", body: [
        "Each plan's card lists exactly what it unlocks — how many bots and products you get, and which higher-tier tools (analytics, automation, white-label branding) are included. Compare them side by side before you commit.",
      ] },
      { h: "Billing", body: [
        "Pricing is in Telegram Stars, charged for whichever period you pick at checkout — longer commitments get an automatic discount over paying month to month.",
      ] },
      { h: "If a plan expires", body: [
        { type: "note", text: "Nothing is deleted when a subscription lapses — your store pauses gracefully instead. Renewing at any point restores everything exactly as you left it." },
      ] },
    ] },
  { id: "mybots", title: "My Bots Guide", icon: "🤖",
    summary: "Create, manage, and monitor every bot you've launched from one place.",
    media: null,
    quickAnswers: [
      { q: "What do the status colors mean?", a: "🔵 Trial, 🟢 Active, 🟡 Low Credits, 🟠 Grace period, ⚫ Sleeping, 📦 Archived — shown right on each bot's card." },
      { q: "What happens to a Sleeping bot?", a: "It's paused, not deleted — reactivate it any time and everything comes back as you left it." },
      { q: "Can someone else help manage my bot?", a: "Yes — delegate access with specific permissions from that bot's Admins settings." },
    ],
    sections: [
      { h: "Reading the status colors", body: [
        { list: [
          "🔵 Trial — your evaluation period, full features, time-limited.",
          "🟢 Active — running normally, Credits topped up.",
          "🟡 Low Credits — still running, but recharge soon.",
          "🟠 Grace period — Credits ran out; a short window to recharge before the bot pauses.",
          "⚫ Sleeping — paused, not deleted. Reactivate any time and everything comes back exactly as you left it.",
          "📦 Archived — long-term paused state, same no-data-loss guarantee as Sleeping.",
        ] },
      ] },
      { h: "Delegating access", body: [
        "Add a co-admin from that bot's Admins settings and choose exactly which permissions they get — you're never handing over full control by default.",
      ] },
    ] },
];
