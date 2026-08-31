# Priyam Rupapara — Personal Portfolio Website

An ultra-modern, high-performance, and responsive personal portfolio built with modern HTML5, CSS3, and JavaScript.

---

## 🌟 Highlights

- **Responsive**: Mobile-first design optimized for phones, tablets, laptops, and ultra-wide displays.
- **Buttery Smooth**: Hardware-accelerated animations, glassmorphic backdrop filters, ambient glow orbs, and desktop cursor glow tracking.
- **Interactive Live Lab**:
  - **ASTM Medical Analyzer Ingestion Simulator**: Live test parsing of clinical ASTM strings into structured parameters with range/QC flag detection.
  - **D2C Unit Economics & RTO Margin Calculator**: Real-time modeling of Indian e-commerce CAC, COD mix, and return freight penalties.
- **Command Palette (`⌘K` / `Ctrl+K`)**: Fast keyboard-driven search and quick actions.
- **Theme Engine**: Seamless dark and light mode toggle with `localStorage` persistence.
- **SURGE Post-Mortem & Founder Story**: Honest case study highlighting business metrics and engineering DNA.
- **Zero Build Step**: Runs directly in any web browser without npm installs or bundlers.

---

## 🚀 How to View Locally

### Option 1: Open Directly in Browser
Simply double-click `portfolio/index.html` or open it in Chrome / Safari / Edge:
```bash
open portfolio/index.html
```

### Option 2: Run with any local HTTP server
```bash
# Using Python
cd portfolio
python3 -m http.server 3000

# Using Node / npx
npx serve portfolio
```
Visit `http://localhost:3000` in your browser.

---

## 🌐 1-Minute Deployment Options

### Deploy to GitHub Pages (Free)
1. Push this folder to your GitHub repository `rupaparapriyam/rupaparapriyam.github.io` or under `gh-pages` branch.
2. Under Repository **Settings → Pages**, select the root or `/portfolio` directory.
3. Your site is live at `https://rupaparapriyam.github.io`!

### Deploy to Vercel (1-Click)
1. Import the repository into [Vercel](https://vercel.com).
2. Set Root Directory to `portfolio`.
3. Click **Deploy**.

---

## 📂 File Architecture

```
portfolio/
├── index.html       # Semantic HTML5, accessible structure, SEO & OpenGraph tags
├── styles.css       # Design system, CSS variables, fluid typography, dark/light themes
├── app.js           # Interactive engine (ASTM parser, D2C calculator, ⌘K, theme)
└── README.md        # Documentation & deployment guide
```
