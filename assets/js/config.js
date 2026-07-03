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
  telegram: "https://t.me/DigiHubProBot",       // main contact / support link
  supportChannel: "https://t.me/DigiHubProBot", // announcements / support channel
  email: "mohitrp4412@gmail.com",               // shown on legal pages as contact
  year: 2026,

  /* Homepage hero */
  hero: {
    eyebrow: "// Telegram bot platforms",
    title: "Bots that run <span class='hl'>businesses</span>, not just chats.",
    lead: "We build multi-tenant Telegram platforms — store bots, approval bots and moderation tools — engineered for audiences in the hundreds of thousands.",
    primaryBtn: { label: "Explore DigiHub", href: "project.html?id=digihub" },
    ghostBtn: { label: "All projects", href: "#projects" },
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
  },

  /* Homepage "Features" grid — shown right under the hero. */
  featuresEyebrow: "// Features",
  featuresTitle: "Everything you need to run a Telegram business",
  features: [
    { icon: "🛍️", title: "Stars payments", desc: "Sell digital products with native Telegram Stars — no gateways, no cards, no country restrictions." },
    { icon: "📦", title: "Channel-based storage", desc: "Products and files stay in your own private channel. We store only the message ID needed to deliver them." },
    { icon: "🤖", title: "Your own clone bot", desc: "Every platform runs under your brand, with your own bot token from @BotFather — not ours." },
    { icon: "✅", title: "Auto join-request approval", desc: "Approve members automatically with smart delays, then welcome every one of them for you." },
    { icon: "🔐", title: "Encrypted at rest", desc: "Bot tokens are encrypted with Fernet — nobody, including us, can read them in plain text." },
    { icon: "🧹", title: "Clean, spam-free UX", desc: "Inline menus with proper back-flows. Setup messages and tokens auto-delete after use." },
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
    short: "Shopify for Telegram. Sell digital products through your own clone bot — files stay in your channel, payments in Stars.",
    details: {
      botUsername: "@DigiHubProBot",
      botLink: "https://t.me/DigiHubProBot",
      eyebrow: "// DigiHub · live",
      headline: "Your Telegram store, running on your own bot.",
      sub: "DigiHub lets creators launch a personal storefront bot in minutes. Your products live in your private channel, your buyers pay in Telegram Stars, and DigiHub automates everything in between.",
      ctaLabel: "Start selling — it's free",

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
        { icon: "🤖", title: "Your own clone bot", desc: "Connect a bot token and get a fully branded store bot under your name — not ours. Buyers only ever see your brand." },
        { icon: "📦", title: "Channel-based storage", desc: "Products are stored in your private channel. We keep only message IDs — your files never sit on our servers." },
        { icon: "⭐", title: "Telegram Stars payments", desc: "Native in-app payments. No gateways, no cards, no country restrictions. Money lands in your Telegram wallet." },
        { icon: "⚡", title: "Instant delivery", desc: "Payment confirmed → product delivered in the same chat, in seconds, 24/7. No manual work, ever." },
        { icon: "🔐", title: "Encrypted tokens", desc: "Bot tokens are encrypted at rest with Fernet. Nobody — including us — can read them in plain text." },
        { icon: "📊", title: "Sales dashboard", desc: "Track orders, revenue and top products right inside the bot with clean inline menus. No spam, everything self-cleans." },
      ],

      steps: [
        { title: "Create your bot", desc: "Get a token from @BotFather and connect it to DigiHub." },
        { title: "Add your products", desc: "Forward files to your private storage channel and list them with a price in Stars." },
        { title: "Share your store", desc: "Drop your bot link in your channel or bio. Buyers browse with inline menus." },
        { title: "Get paid, auto-deliver", desc: "Stars arrive in your wallet, the file arrives in the buyer's chat. Done." },
      ],

      tiers: [
        { name: "Free",    price: "0",   unit: "⭐ / mo", tag: "",             perks: ["1 clone bot", "Up to 5 products", "Stars payments", "Instant delivery"] },
        { name: "Silver",  price: "99",  unit: "⭐ / mo", tag: "",             perks: ["1 clone bot", "25 products", "Sales stats", "Priority delivery queue"] },
        { name: "Gold",    price: "249", unit: "⭐ / mo", tag: "Most popular", perks: ["3 clone bots", "Unlimited products", "Full dashboard", "Broadcast to buyers"] },
        { name: "Elite",   price: "499", unit: "⭐ / mo", tag: "",             perks: ["10 clone bots", "Unlimited everything", "Custom branding", "Direct support line"] },
      ],

      faq: [
        { q: "Do my files get uploaded to your servers?", a: "No. Files stay in a private Telegram channel that you own. DigiHub stores only the message ID and channel ID needed to forward the product after purchase." },
        { q: "What happens if my subscription expires?", a: "Your store pauses gracefully — nothing is deleted. Renew any time and everything comes back exactly as you left it." },
        { q: "Can buyers spam my store bot?", a: "The bot UI is fully inline — buyers navigate with buttons and back-flows, and any text or tokens sent during setup are auto-deleted after use. Chats stay clean." },
        { q: "Which payment methods are supported?", a: "Telegram Stars, natively. Stars work in every country Telegram works in, with no card or gateway setup." },
      ],

      cta: {
        title: "Open your store today",
        text: "Connect a bot token from @BotFather and list your first product in under five minutes. The Free plan needs no payment at all.",
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
    updated: "July 2, 2026",
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
        h: "2. Information we collect",
        body: [
          "When you interact with our bots, we collect and store:",
          { list: [
            "Your Telegram user ID, username and first name (provided by Telegram with every message).",
            "Bot tokens you connect to create a clone bot. Tokens are encrypted at rest and are never shown or shared in plain text.",
            "Product listings you create: title, description, price, and the Telegram channel ID and message ID where the file is stored.",
            "Order and payment records: which product was bought, when, for how many Stars, and the Telegram payment identifiers needed for delivery and support.",
            "Deposit screenshots, if you submit one for a manual payment — these are forwarded to a private admin channel for verification.",
            "Basic usage data such as which menus you open, used to keep the bots reliable and to debug problems.",
          ]},
        ],
      },
      {
        h: "3. What we do NOT collect",
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
        h: "4. How we use your information",
        body: [
          { list: [
            "To run the service: deliver products, manage your store or approval bot, and enforce plan limits.",
            "To process payments and keep records of orders for support and dispute resolution.",
            "To send you service messages inside Telegram (order confirmations, subscription reminders).",
            "To prevent abuse, fraud and violations of our Terms & Conditions.",
          ]},
          "We do not sell your data, show ads, or share your information with third parties for marketing.",
        ],
      },
      {
        h: "5. Storage and security",
        body: [
          "Data is stored in a PostgreSQL database on our servers. Clone bot tokens are encrypted at rest using Fernet symmetric encryption; nobody — including our team — can read them in plain text.",
          "Files and screenshots live inside Telegram's own infrastructure (private channels), protected by Telegram's security. Access to our database and admin channels is restricted to the project administrators.",
        ],
      },
      {
        h: "6. Third parties",
        body: [
          "Our services are built on the official Telegram Bot API, so all activity also falls under Telegram's own Privacy Policy and Terms of Service.",
          "Payments in Telegram Stars are handled by Telegram. Manual deposits (for example UPI) are verified by our team from the screenshot you submit; we do not receive access to your bank or UPI account.",
        ],
      },
      {
        h: "7. Data retention and deletion",
        body: [
          "We keep your data for as long as you use the service. If your subscription expires, your data is kept so you can resume where you left off.",
          "You can request deletion of your account data (store, products metadata, clone bot tokens) at any time by contacting us on Telegram. We will delete it within 30 days, except records we must keep for fraud prevention or legal reasons.",
        ],
      },
      {
        h: "8. Children",
        body: [
          "Our services are not directed at children under 13 (or the minimum age required by Telegram in your country). We do not knowingly collect data from children.",
        ],
      },
      {
        h: "9. Changes to this policy",
        body: [
          "We may update this policy as the service evolves. The 'Last updated' date at the top always reflects the current version. Significant changes will be announced in our Telegram channel.",
        ],
      },
      {
        h: "10. Contact",
        body: [
          "Questions about privacy? Message us on Telegram or email us — both are listed in the footer of this site.",
        ],
      },
    ],
  },

  {
    id: "terms",
    title: "Terms & Conditions",
    updated: "July 2, 2026",
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
            "Paid plans are billed in Telegram Stars (or other methods we may offer, such as manual deposits) for the period shown at purchase.",
            "Plan limits (number of clone bots, number of products, features) are enforced automatically.",
            "If your subscription expires, your store pauses gracefully — nothing is deleted, and renewing restores everything.",
            "Prices may change; changes apply from your next renewal, never retroactively.",
          ]},
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
          "Questions about these terms? Reach us on Telegram or by email — links are in the footer of this site.",
        ],
      },
    ],
  },
];
