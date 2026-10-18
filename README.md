<div align="center">
  <h1>🌹 Perfume Store</h1>
  <p><strong>Luxury fragrance e-commerce built with Next.js 15 App Router — multilingual, animated, type-safe</strong></p>

  [![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
  [![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0055?style=flat-square&logo=framer&logoColor=white)](https://framer.com/motion)
  [![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)
</div>

---

## Overview

A production-quality luxury perfume store built with the **Next.js 15 App Router** and **React 19**. The focus is on premium UX — fragrance pyramid breakdowns (top / heart / base notes), volume-based dynamic pricing, smooth Framer Motion page transitions, and multi-language support.

Everything is type-safe end-to-end with TypeScript 5, structured around a clean feature-based architecture with strict separation between data, UI, and business logic.

---

## Features

### Product Experience
- **Fragrance pyramid** — visual top / heart / base note breakdown per product
- **Volume selector** — 30ml / 50ml / 100ml with live price recalculation
- **Curated imagery** — high-quality stock photos mapped per product
- **Product filtering** — by fragrance family, concentration, gender, brand

### Commerce
- **Shopping cart** — add items, update quantity, remove, clear
- **Dynamic pricing** — volume × price_per_ml, formatted per locale
- **Localized product data** — product names, descriptions per language

### Technical
- **Next.js 15 App Router** — layouts, loading states, error boundaries
- **React 19** — concurrent features, useOptimistic, server actions ready
- **Framer Motion 12** — page transitions, hover effects, stagger animations
- **TypeScript 5 strict mode** — full type coverage, no `any`
- **Multi-language** — i18n translation layer, switchable at runtime
- **Mobile-first** — fully responsive from 320px

---

## Quick Start

```bash
git clone https://github.com/daudbro73-collab/PerfumeProject.git
cd PerfumeProject
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # Production build (Next.js SWC compiler)
npm run start      # Start production server
npm run lint       # ESLint check
```

---

## Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout, font loading, providers
│   ├── page.tsx            # Home / catalog page
│   └── [slug]/             # Dynamic product detail pages
├── components/
│   ├── ProductCard/        # Catalog card with hover animation
│   ├── ProductDetail/      # Full product page (pyramid, selector)
│   ├── Cart/               # Cart sheet / drawer
│   ├── Filters/            # Sidebar filter panel
│   └── ui/                 # Primitives (Button, Badge, etc.)
├── data/
│   ├── products.ts         # Full product catalog (typed)
│   └── stock-images.ts     # Image URL map per product
├── i18n/
│   └── translations.ts     # All UI strings per language
├── lib/
│   ├── filters.ts          # Filter logic (pure functions)
│   ├── volumes.ts          # Volume / pricing calculations
│   ├── localizeProduct.ts  # Per-locale product data resolver
│   ├── productTypes.ts     # Concentration, family, gender enums
│   └── utils.ts            # cn(), formatPrice(), etc.
└── types/
    └── index.ts            # Product, CartItem, FilterState types
```

---

## Tech Stack

| | Technology | Version |
|-|------------|---------|
| 🏗️ | Next.js App Router | 15 |
| ⚛️ | React | 19 |
| 🔷 | TypeScript (strict) | 5 |
| 🎞️ | Framer Motion | 12 |
| 🎨 | CSS Modules + custom props | — |
| 🔣 | Lucide React | latest |
| 🧰 | clsx | 2.x |
| ⚡ | SWC compiler | built-in |

---

<div align="center">
  <strong>Built by Rustam Berheev</strong><br/>
  <a href="https://github.com/daudbro73-collab">github.com/daudbro73-collab</a>
</div>
