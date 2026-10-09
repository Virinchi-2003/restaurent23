# Bowls. — Artisan Wholesome Bowls & Healthy Eats

[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Turso DB](https://img.shields.io/badge/Database-Turso%20LibSQL-4FF8D2?style=flat&logo=sqlite&logoColor=black)](https://turso.tech/)
[![Netlify Ready](https://img.shields.io/badge/Deploy-Netlify%20Ready-00C7B7?style=flat&logo=netlify&logoColor=white)](https://www.netlify.com/)

A modern, high-performance, and visually captivating restaurant web application built with **React**, **Vite**, **Vanilla CSS**, and **Turso LibSQL**. Features dynamic 2.5D interactive dish showcasing, background video integration, online ordering, table reservations, and database synchronization.

---

## ✨ Features & Architecture

### 1. Interactive 2.5D Hero Showcase
- **Rotating Signature Bowls**: Interactive 3D carousel featuring signature culinary bowls (*Grilled Chicken & Broccoli Quinoa Bowl*, *Golden Coconut Curry Delight*, *Fresh Greek Salad*, *Artisan Chicken Wrap*, and *Pacific Salmon Poke*).
- **Floating Parallax Elements**: Isolated ingredients (*organic basil leaves, dewy cherry tomatoes, and mushrooms*) responding to mouse coordinates.
- **Ambient Culinary Video Background**: Background video with smooth brightness overlays and optimized playback.

### 2. Live Turso Database Integration
- **Real-Time Data Syncing**: Connected to a live Turso SQLite database (hosted in AWS `ap-south-1`).
- **Database Schema & Tables**:
  - `menu_items`: Stores dish title, category, price (₹), calories, macros, ratings, and hero badges.
  - `orders`: Records customer checkout submissions with order IDs, customer contacts, order item details, and payment methods.
  - `reservations`: Manages table booking requests with date, time, guest count, and seating preference.
  - `subscribers`: Captures newsletter email subscribers and issues discount vouchers.
  - `reviews`: Stores testimonials and guest ratings.
- **Client Resilience**: Automatic local fallback handling to guarantee fast rendering even under zero network connectivity.

### 3. Customer Experience & Ordering Flow
- **Slide-out Cart Drawer**:
  - Real-time quantity adjustment (`+`, `-`, delete).
  - Promo code engine (`TASTY20` applies an instant 20% discount).
  - Free delivery threshold calculations.
- **Interactive Modals**:
  - **Dish Detail Modal**: Full macro-nutrient display (*Protein, Carbs, Fat, Calories*), spice levels, and custom additions.
  - **Table Reservation Modal**: Table reservations with immediate booking codes (`BWL-RES-XXXX`).
  - **Checkout Modal**: Delivery addresses, payment method options, celebratory confetti, and live database sync badges.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 5
- **Styling**: Vanilla CSS (CSS Variables, Flexbox, CSS Grid, Fluid Typography)
- **Database**: [Turso (LibSQL)](https://turso.tech/) via `@libsql/client/web`
- **Icons & Effects**: [Lucide React](https://lucide.dev/), Canvas Confetti
- **Deployment**: [Netlify](https://www.netlify.com/) (Pre-configured SPA routing and asset caching)

---

## 🚀 Quick Start & Local Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or v20+ recommended)
- `npm` or `pnpm`

### 2. Clone and Install Dependencies
```bash
git clone <your-repository-url>
cd Restaurent
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory (refer to `.env.example`):

```env
VITE_TURSO_DATABASE_URL=https://restaurent-virinchi-2003.aws-ap-south-1.turso.io
VITE_TURSO_AUTH_TOKEN=your_turso_auth_token_here
```

> **Note**: Both `https://...` and `libsql://...` URLs are automatically handled and normalized for browser fetch compatibility.

### 4. Database Initialization & Seeding
To initialize the database schema and seed default menu items and reviews into Turso:

```bash
npm run seed
```

### 5. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 6. Production Build
```bash
npm run build
```
Creates an optimized production bundle inside the `dist/` directory.

---

## 🌐 Deploying to Netlify

This project is fully configured for seamless 1-click deployment on **Netlify**.

### Option A: Deploy via GitHub / GitLab / Bitbucket (Recommended)

1. **Push your code to a Git repository**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit with turso db sync and netlify config"
   git branch -M main
   git remote add origin <your-git-remote-url>
   git push -u origin main
   ```

2. **Connect to Netlify**:
   - Go to [Netlify App](https://app.netlify.com/) and click **"Add new site"** > **"Import an existing project"**.
   - Select your Git provider and choose the repository.

3. **Build Settings**:
   - Netlify will automatically detect settings from [netlify.toml](netlify.toml):
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`

4. **Environment Variables on Netlify**:
   - Go to **Site Configuration** > **Environment variables** > **Add variable**:
     - `VITE_TURSO_DATABASE_URL` = `https://restaurent-virinchi-2003.aws-ap-south-1.turso.io`
     - `VITE_TURSO_AUTH_TOKEN` = `<your_turso_auth_token>`
   - Click **Deploy Site**.

### Option B: Deploy via Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```
2. Login and deploy:
   ```bash
   netlify login
   netlify init
   netlify deploy --prod
   ```

---

## 📁 Repository Structure

```
├── .env.example             # Template for environment variables
├── .gitignore               # Excludes secrets, dependencies, and build artifacts
├── netlify.toml             # Netlify build, SPA redirects, and asset caching headers
├── package.json             # NPM scripts and project dependencies
├── vite.config.js           # Vite configuration
├── index.html               # Main HTML entry point
├── public/
│   ├── _redirects           # Netlify SPA redirect fallback (/* /index.html 200)
│   ├── images/              # Culinary photos and transparent 2.5D assets
│   └── videos/              # Video backgrounds (chopping vegetables)
├── scripts/
│   └── seed-turso.js        # Node.js script to create tables and seed Turso data
└── src/
    ├── App.jsx              # Main application root & state orchestrator
    ├── index.css            # Responsive styles and design tokens
    ├── db/
    │   └── turso.js         # Turso database client queries & mutations
    ├── data/
    │   ├── menuData.js      # Menu item definitions & fallback data
    │   └── reviewsData.js   # Customer testimonials
    └── components/
        ├── Navbar.jsx           # Header navigation & cart trigger
        ├── HeroSection.jsx      # 2.5D rotating hero plate & background video
        ├── PromiseSection.jsx   # Farm-to-Table & Flash Delivery showcase
        ├── HowItWorksSection.jsx# 3-step order workflow
        ├── MenuSection.jsx      # Dynamic filterable menu grid
        ├── TestimonialsSection.jsx # Customer review carousel
        ├── NewsletterSection.jsx# Promo code unlock & email capture
        ├── FooterSection.jsx    # Footer with live Turso DB sync indicator
        ├── CartDrawer.jsx       # Slide-out shopping cart
        ├── DishDetailModal.jsx  # Nutrition breakdown & custom toppings
        ├── ReservationModal.jsx # Table reservation booking modal
        ├── CheckoutModal.jsx    # Order completion & tracking modal
        └── Toast.jsx            # Toast alerts
```

---

## 🔒 Security Best Practices

- `.env` is ignored by `.gitignore` to prevent leaking database credentials into version control.
- In production, configure environment variables directly within the Netlify Dashboard.
- Netlify security headers (`X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`) are included in `netlify.toml`.

---

## 📄 License
MIT License. Created for Bowls Culinary Inc.
