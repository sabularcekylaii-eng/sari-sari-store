# 🏪 Sari-Sari Store Manager

Inventory, sales tracking, and receipt printing for your tindahan.
Works on mobile, tablet, and desktop.

## Live Demo
> URL will appear here after deploying

---

## Features
- 📦 Product inventory with categories (Canned Goods, Snacks, Drinks, Sabon/Linis, etc.)
- 🔍 Smart product search — search from 50+ common sari-sari products
- 🛒 Customer cart with qty controls and checkout
- 🧾 Receipt preview + print (works with any printer or Save as PDF)
- 📊 Sales charts by day / month / year
- 💡 Low-stock suggestions for grocery shopping
- 🌙 Dark mode
- 🇵🇭 English / Filipino language toggle
- 📱 PWA — installable on phone like an app

---

## Tech Stack
| Layer      | Tech                        |
|------------|-----------------------------|
| Frontend   | Vanilla JS + Vite           |
| Styling    | CSS custom properties       |
| Charts     | Chart.js                    |
| Icons      | Tabler Icons                |
| Storage    | localStorage (Phase 1)      |
| Hosting    | GitHub Pages / Netlify / Vercel |
| CI/CD      | GitHub Actions              |

---

## Getting Started (Local Development)

### Prerequisites
- Node.js 18 or higher — download at [nodejs.org](https://nodejs.org)
- Git — download at [git-scm.com](https://git-scm.com)

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/sari-sari-store.git
cd sari-sari-store

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
# Opens at http://localhost:3000
```

---

## Deploy to GitHub Pages (Free)

### One-time setup
1. Push code to GitHub
2. Go to your repo → Settings → Pages
3. Set Source to **GitHub Actions**
4. That's it — every push to `main` auto-deploys!

```bash
git add .
git commit -m "initial commit"
git push origin main
```

---

## Deploy to Netlify (Free, Easier)

1. Go to [netlify.com](https://netlify.com) → New site from Git
2. Connect your GitHub repo
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Click Deploy — done!

---

## Deploy to Vercel (Free, Fastest)

```bash
npm install -g vercel
vercel
# Follow the prompts
```

---

## Project Structure

```
sari-sari-store/
├── .github/
│   └── workflows/
│       └── deploy.yml        ← GitHub Actions CI/CD
├── public/
│   ├── manifest.json         ← PWA config
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── setup.js          ← Store name setup screen
│   │   ├── layout.js         ← Topbar, sidebar, mobile nav
│   │   ├── products.js       ← Product grid, search, categories
│   │   ├── customer.js       ← Cart and checkout
│   │   ├── receipt.js        ← Receipt preview and print
│   │   ├── sales.js          ← Sales log
│   │   ├── reports.js        ← Charts (day/month/year)
│   │   └── modal.js          ← Add/edit product modals
│   ├── data/
│   │   ├── categories.js     ← Category list with emoji + Tagalog
│   │   ├── knownProducts.js  ← 50+ pre-loaded product suggestions
│   │   └── sampleProducts.js ← Default products on first launch
│   ├── utils/
│   │   ├── state.js          ← Central app state
│   │   ├── storage.js        ← localStorage wrapper
│   │   ├── i18n.js           ← English / Filipino translations
│   │   └── formatters.js     ← Money format, date helpers
│   ├── styles/
│   │   └── main.css          ← All styles + dark mode tokens
│   └── main.js               ← Entry point, all action handlers
├── index.html
├── vite.config.js
├── netlify.toml
├── vercel.json
├── .gitignore
├── .env.example
└── package.json
```

---

## Roadmap

| Phase | Feature                          | Status      |
|-------|----------------------------------|-------------|
| 1     | GitHub + Deploy                  | ✅ Done      |
| 2     | Backend API (Node.js + Express)  | 🔜 Next     |
| 3     | Database (Supabase + PostgreSQL) | 🔜 Planned  |
| 4     | Auth (Clerk — Owner/Cashier)     | 🔜 Planned  |
| 5     | Testing (Vitest + Playwright)    | 🔜 Planned  |
| 6     | Monitoring (Sentry + Upstash)    | 🔜 Planned  |

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values.
Never commit `.env` to GitHub — it's in `.gitignore`.

```bash
cp .env.example .env
```

---

## Contributing
Pull requests welcome. For big changes, open an issue first.

## License
MIT
