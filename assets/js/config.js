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
  tagline: "Telegram bot platforms, built to scale.",
  telegram: "https://t.me/DigiHubProBot",           // "Open/Try in Telegram" CTAs — the actual product bot
  supportChannel: "https://t.me/DigiHubSupportBot", // footer "Support on Telegram" link
  email: "contact@digihubhmax.com",                 // footer contact — general inquiries
  year: 2026,

  /* Homepage hero */
  hero: {
    eyebrow: "// Telegram bot platforms for admins",
    title: "One bot for your whole community — <span class='hl'>not just a store</span>.",
    lead: "DigiHub gives creators a complete toolkit inside Telegram — a store, custom menus, forms, auto-replies, broadcasts, coupons, giveaways, live chat and channel-gated access — all running under your own bot, on your own brand.",
    primaryBtn: { label: "See all modules", href: "#features" },
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

  /* Homepage "Features" grid — shown right under the hero.
     This lists every real module the bot has, not just the store. */
  featuresEyebrow: "// Features",
  featuresTitle: "Everything you need to run your Telegram community",
  features: [
    { icon: "🤖", title: "Your own clone bot", desc: "Every bot runs under your brand, with your own bot token from @BotFather — not ours." },
    { icon: "🛍️", title: "Shop & Stars payments", desc: "Sell digital products with native Telegram Stars. Files stay in your channel, buyers get instant delivery." },
    { icon: "🧭", title: "Menu builder", desc: "Build custom navigation pages with buttons linking to your shop, forms, links or channels — no coding." },
    { icon: "📝", title: "Forms", desc: "Create conversational, multi-step forms. Customers can pause and resume anytime, progress bar included." },
    { icon: "💬", title: "Auto-replies", desc: "Set keyword-triggered replies so common questions get answered instantly, day or night." },
    { icon: "📣", title: "Broadcast", desc: "Send scheduled or one-off messages to your audience, with built-in cooldowns so you never look spammy." },
    { icon: "🎯", title: "Customer segments", desc: "Target broadcasts to specific groups — like your top spenders — instead of messaging everyone." },
    { icon: "🏷️", title: "Coupons", desc: "Create percentage or fixed discount codes, scoped to products or categories, with usage limits." },
    { icon: "🔒", title: "Channel-gated access", desc: "Require customers to join your channel(s) before they can use the bot — grow your channel while you sell." },
    { icon: "📊", title: "Dashboard & analytics", desc: "See orders, revenue and audience growth in one place, without digging through chat history." },
    { icon: "🔔", title: "Smart notifications", desc: "Choose which events ping you — new orders, low stock, daily summaries — so you're never buried in alerts." },
    { icon: "🔐", title: "Encrypted at rest", desc: "Bot tokens are encrypted with Fernet — nobody, including us, can read them in plain text." },
    { icon: "🎉", title: "Giveaways", desc: "Run join-to-enter giveaways with automatic winner picking and full entry analytics — no spreadsheets." },
    { icon: "🗨️", title: "Live chat", desc: "Customers message you straight through the bot — replies relay back instantly, with owner-defined keyword filtering to block spam before it reaches you." },
    { icon: "⚙️", title: "Automation & drip sequences", desc: "Fire welcome messages, coupons or credit rewards automatically on join or purchase — or build multi-step drip sequences that run on their own." },
    { icon: "🏆", title: "Achievements", desc: "Unlock badges as your store grows — a portfolio that tracks your progress automatically, always visible even while your bot sleeps." },
    { icon: "🎁", title: "Referrals & Credits", desc: "Earn DigiHub Credits by referring other creators, then spend them on upgrades or convert them into customer credits for your own store." },
    { icon: "🌍", title: "Built for every market", desc: "New users pick their country and language on first launch — pricing and text adapt automatically." },
    { icon: "👥", title: "Team access", desc: "Delegate store management to trusted admins with granular, revocable permissions — every action fully audited (Gold and up)." },
  ],

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
        { icon: "🎉", title: "Giveaways", desc: "Run join-to-enter giveaways with automatic winner picking and full entry analytics." },
        { icon: "🗨️", title: "Live chat", desc: "Customers message you straight through the bot, with instant reply relay and owner-defined spam-keyword filtering." },
        { icon: "⚙️", title: "Automation & drip sequences", desc: "Fire welcome messages, coupons or credit rewards on join or purchase — or build multi-step drip sequences." },
        { icon: "🏆", title: "Achievements", desc: "Unlock badges as your store grows — always visible in your creator portfolio, even while the bot sleeps." },
        { icon: "🎁", title: "Referrals & Credits", desc: "Earn DigiHub Credits by referring other creators — spend them on upgrades or convert to customer credits." },
        { icon: "🌍", title: "Built for every market", desc: "New users pick their country and language on first launch — pricing and text adapt automatically." },
        { icon: "👥", title: "Team access", desc: "Delegate store management to trusted admins with granular, revocable, fully audited permissions." },
      ],

      steps: [
        { title: "Create your bot", desc: "Get a token from @BotFather and connect it to DigiHub." },
        { title: "Add your products", desc: "Forward files to your private storage channel and list them with a price in Stars." },
        { title: "Share your store", desc: "Drop your bot link in your channel or bio. Buyers browse with inline menus." },
        { title: "Get paid, auto-deliver", desc: "Stars arrive in your wallet, the file arrives in the buyer's chat. Done." },
      ],

      tiers: [
        { name: "Free",     price: "0",   unit: "⭐ / mo", tag: "",             perks: ["1 clone bot", "Up to 20 products", "Stars payments", "Instant delivery"] },
        { name: "Silver",   price: "100", unit: "⭐ / mo", tag: "",             perks: ["1 clone bot", "Up to 100 products", "Sales stats", "1 force-join channel"] },
        { name: "Gold",     price: "250", unit: "⭐ / mo", tag: "Most popular", perks: ["3 clone bots", "Up to 500 products", "Full dashboard", "Team access — up to 5 admins"] },
        { name: "Elite",    price: "500", unit: "⭐ / mo", tag: "",             perks: ["10 clone bots", "Unlimited products", "White-label — no DigiHub branding", "Team access — up to 20 admins"] },
        { name: "Business", price: "750", unit: "⭐ / mo", tag: "",             perks: ["10 clone bots", "Unlimited products", "6 force-join channels", "Team access — up to 50 admins"] },
      ],

      faq: [
        { q: "Do my files get uploaded to your servers?", a: "No. Files stay in a private Telegram channel that you own. DigiHub stores only the message ID and channel ID needed to forward the product after purchase." },
        { q: "What happens if my subscription expires?", a: "Your store pauses gracefully — nothing is deleted. Renew any time and everything comes back exactly as you left it." },
        { q: "Can buyers spam my store bot?", a: "The bot UI is fully inline — buyers navigate with buttons and back-flows, and any text or tokens sent during setup are auto-deleted after use. Chats stay clean." },
        { q: "Which payment methods are supported?", a: "Telegram Stars, natively. Stars work in every country Telegram works in, with no card or gateway setup." },
      ],

      cta: {
        title: "Open your bot today",
        text: "Connect a bot token from @BotFather and get your first menu, form or product live in under five minutes. The Free plan needs no payment at all.",
        btnLabel: "Launch DigiHub bot",
      },
    },
  },

  {
    id: "requestaccepter",
    name: "Request Accepter Pro",
    emoji: "✅",
    status: "live",
    short: "Auto-approve join requests on private channels with smart delays. Clone your own approval bot in one minute.",
    details: {
      botUsername: "@RequestAccepterBot",
      botLink: "https://t.me/DigiHubProBot",   // ← replace with the real bot link
      eyebrow: "// Request Accepter Pro · live",
      headline: "Join requests, approved on autopilot.",
      sub: "Stop approving members by hand. Request Accepter Pro watches your private channels and groups, approves join requests with smart delays, and welcomes every new member — from your own branded bot.",
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
        { icon: "⚡", title: "Instant or delayed approval", desc: "Approve immediately, or use randomized smart delays so growth looks organic and stays within Telegram limits." },
        { icon: "🤖", title: "Your own clone bot", desc: "Connect a token from @BotFather and the approval bot runs under your brand, not ours." },
        { icon: "📢", title: "Multiple channels & groups", desc: "One bot manages join requests across all your private channels and groups from a single dashboard." },
        { icon: "👋", title: "Welcome messages", desc: "Automatically DM every approved member with your custom welcome text, links or rules." },
        { icon: "📊", title: "Growth stats", desc: "See how many requests were approved today, this week and all-time — right inside the bot." },
        { icon: "🧹", title: "Zero spam setup", desc: "Fully inline setup flow. Tokens and setup messages are auto-deleted after use." },
      ],

      steps: [
        { title: "Create your bot", desc: "Get a token from @BotFather and connect it in one message." },
        { title: "Add it to your channel", desc: "Make your clone bot an admin with the 'Add members' right." },
        { title: "Pick a mode", desc: "Instant approval or smart randomized delays — your choice." },
        { title: "Relax", desc: "Requests get approved 24/7 and every member gets your welcome message." },
      ],

      tiers: [],   // no public pricing yet — section auto-hides

      faq: [
        { q: "Is auto-approving allowed by Telegram?", a: "Yes — bots with admin rights can approve join requests via the official Bot API. Smart delays keep the pattern natural." },
        { q: "Does the bot need access to my messages?", a: "No. It only needs the admin right to manage join requests in the channels you add it to." },
      ],

      cta: {
        title: "Approve your next 1,000 members automatically",
        text: "Set up takes about a minute. Connect a token, add the bot to your channel, done.",
        btnLabel: "Start on Telegram",
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
    sections: [] },
  { id: "giveaways", title: "Giveaways Guide", icon: "🎉",
    summary: "Run join-to-enter giveaways with automatic winner picking, entry tracking, and full analytics.",
    media: null,
    quickAnswers: [
      { q: "How are winners picked?", a: "Automatically and randomly from everyone who met the entry conditions when the giveaway ends." },
      { q: "Can I require customers to join a channel to enter?", a: "Yes — set join conditions when you create the giveaway." },
      { q: "How is the reward delivered?", a: "Automatically, to each winner, the moment the giveaway ends — no manual step needed." },
    ],
    sections: [] },
  { id: "forms", title: "Forms Guide", icon: "📝",
    summary: "Build conversational, multi-step forms. Customers can pause and resume anytime, with a visible progress bar.",
    media: null,
    quickAnswers: [
      { q: "Can customers pause and come back later?", a: "Yes — forms save progress automatically, with a visible progress bar." },
      { q: "Where do submitted answers go?", a: "You get a notification with all their answers in one view the moment they submit." },
      { q: "What happens after someone submits?", a: "You can optionally route them to a specific menu or page once they finish." },
    ],
    sections: [] },
  { id: "broadcast", title: "Broadcast Guide", icon: "📣",
    summary: "Send scheduled or one-off messages to your audience, with built-in cooldowns and customer-segment targeting.",
    media: null,
    quickAnswers: [
      { q: "Who can I send a broadcast to?", a: "Everyone, or a specific segment — new customers, buyers, high spenders, inactive users, and more." },
      { q: "Is there a cooldown between broadcasts?", a: "Yes, scaled to your plan — the panel shows exactly when you can send your next one." },
      { q: "Can I test before sending to everyone?", a: "Yes — Test First sends it only to you before it goes out to real customers." },
    ],
    sections: [] },
  { id: "automation", title: "Automation Guide", icon: "⚙️",
    summary: "Trigger welcome messages, coupons, or credit rewards automatically when a customer joins or buys — or build multi-step drip sequences that run on their own.",
    media: null,
    quickAnswers: [
      { q: "What can trigger a rule?", a: "A customer joining your bot or completing a purchase — set once, it runs on its own from then on." },
      { q: "What's the difference between Automation and Sequences?", a: "Rules fire once per trigger. Sequences (drip campaigns) send a series of steps over time after the trigger." },
      { q: "Can I delay an action?", a: "Yes — immediately, after a set time (15 min / 1 hour / 24 hours), or a custom delay." },
    ],
    sections: [] },
  { id: "force_join", title: "Force Join Guide", icon: "🔒",
    summary: "Require customers to join your channel(s) before they can use the bot.",
    media: null,
    quickAnswers: [
      { q: "What happens if a customer hasn't joined?", a: "They see a gate asking them to join before they can use the bot — it re-checks automatically once they do." },
      { q: "How many channels can I require?", a: "Depends on your plan — the panel shows your current usage and limit." },
      { q: "Does this affect me, the owner?", a: "No — the gate only applies to customers, never to you." },
    ],
    sections: [] },
  { id: "menu_builder", title: "Menu Builder Guide", icon: "🧭",
    summary: "Build custom navigation pages with buttons linking to your shop, forms, links, or channels — no coding required.",
    media: null,
    quickAnswers: [
      { q: "What can a menu link to?", a: "Your shop, forms, external links, or channels — buttons you place yourself, no coding needed." },
      { q: "Can I set a menu as my bot's homepage?", a: "Yes — set any menu as Home, and it's what customers see when they open your bot." },
      { q: "Is there a limit on menus?", a: "Yes, scaled to your plan — the panel shows how many you've used." },
    ],
    sections: [] },
  { id: "auto_replies", title: "Auto Replies Guide", icon: "💬",
    summary: "Set keyword-triggered replies so common questions get answered instantly, day or night.",
    media: null,
    quickAnswers: [
      { q: "How does DigiHub decide which reply to send?", a: "Whichever rule's trigger text matches what the customer typed — exact or partial match, your choice per rule." },
      { q: "Can I turn a reply off without deleting it?", a: "Yes — tap the toggle next to any rule to disable it temporarily." },
      { q: "Is there a limit on rules?", a: "Yes, scaled to your plan." },
    ],
    sections: [] },
  { id: "live_chat", title: "Live Chat Guide", icon: "🗨️",
    summary: "Let customers message you directly through the bot — replies relay back instantly, with owner-defined keyword filtering to block spam.",
    media: null,
    quickAnswers: [
      { q: "What happens when a customer messages me?", a: "It's relayed to you directly, and your reply gets relayed back to them. Off by default, so nothing changes until you turn it on." },
      { q: "Can I block spam messages?", a: "Yes — set a keyword filter. Matching messages never reach you, and the customer gets a quiet notice instead." },
      { q: "Does this replace Auto Replies?", a: "No — a customer who triggers an Auto Reply still just gets that reply. Live Chat is for everything else." },
    ],
    sections: [] },
  { id: "coupons", title: "Coupons Guide", icon: "🏷️",
    summary: "Create percentage or fixed discount codes, scoped to products or categories, with usage limits.",
    media: null,
    quickAnswers: [
      { q: "Can a coupon apply to just one product?", a: "Yes — scope it to a specific product or category, or leave it store-wide." },
      { q: "Can I limit how many times a coupon is used?", a: "Yes — set a usage limit per coupon when you create it." },
      { q: "Percentage or fixed discount?", a: "Either — choose when you create the coupon." },
    ],
    sections: [] },
  { id: "credits", title: "Credits Guide", icon: "💎",
    summary: "DigiHub Credits cover your per-sale commission — recharge to keep your store online.",
    media: null,
    quickAnswers: [
      { q: "What are Credits actually for?", a: "They cover your per-sale commission — each sale draws from your balance, so your store keeps running as long as you have Credits." },
      { q: "What happens if I run out?", a: "Recharge to keep your store online — the panel shows your balance and roughly how many more sales it covers." },
      { q: "Where do I buy more?", a: "Tap Buy Credits — purchases happen in the main DigiHub bot." },
    ],
    sections: [] },
  { id: "welcome", title: "Welcome Page Guide", icon: "👋",
    summary: "The first thing customers see when they open your bot — your poster, message, and navigation buttons.",
    media: null,
    quickAnswers: [
      { q: "What shows up here?", a: "Whatever a customer sees the moment they open your bot — your poster image, message text, and navigation buttons." },
      { q: "Can I preview it before customers see it?", a: "Yes — tap Preview to see exactly what they'll see." },
      { q: "What if I don't set anything?", a: "DigiHub shows a sensible default until you customize it." },
    ],
    sections: [] },
  { id: "referrals", title: "Referrals Guide", icon: "🎁",
    summary: "Earn DigiHub Credits by referring other creators, with rewards across three tiers.",
    media: null,
    quickAnswers: [
      { q: "How do I earn Credits?", a: "Share your referral link — when another creator subscribes to a paid plan, you earn a percentage automatically." },
      { q: "How many tiers are there?", a: "Three — you earn from people you refer directly, and smaller rewards from the tiers below them." },
      { q: "What can I do with earned Credits?", a: "Use them to upgrade or renew your own subscription, or convert them into customer credits inside one of your stores." },
    ],
    sections: [] },
  { id: "subscriptions", title: "Plans & Subscription Guide", icon: "💎",
    summary: "Compare DigiHub plans, upgrade, and renew — pricing is in Telegram Stars, billed for the period you choose.",
    media: null,
    quickAnswers: [
      { q: "What does upgrading actually unlock?", a: "More bots, more products, and higher-tier tools like analytics, automation, and white-label — each plan's card shows exactly what's included." },
      { q: "What happens if my plan expires?", a: "Your store pauses gracefully — nothing is deleted, and renewing restores everything exactly as it was." },
      { q: "How is pricing billed?", a: "In Telegram Stars, for whichever period you choose — discounts apply automatically for longer commitments." },
    ],
    sections: [] },
  { id: "mybots", title: "My Bots Guide", icon: "🤖",
    summary: "Create, manage, and monitor every bot you've launched from one place.",
    media: null,
    quickAnswers: [
      { q: "What do the status colors mean?", a: "🔵 Trial, 🟢 Active, 🟡 Low Credits, 🟠 Grace period, ⚫ Sleeping, 📦 Archived — shown right on each bot's card." },
      { q: "What happens to a Sleeping bot?", a: "It's paused, not deleted — reactivate it any time and everything comes back as you left it." },
      { q: "Can someone else help manage my bot?", a: "Yes — delegate access with specific permissions from that bot's Admins settings." },
    ],
    sections: [] },
];
