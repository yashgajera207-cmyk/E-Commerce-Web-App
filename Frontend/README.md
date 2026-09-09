# ShopZone — Frontend (React + Vite + Tailwind CSS v4)

This is the storefront frontend for the ShopZone e-commerce UI. Page 1 (**Landing Page / Home**)
is fully built. Every other screen in your mockup (Category Listing, Product Details, Search
Results, Cart, Checkout, Dashboard, Admin, etc.) reuses the same common components, so building
them next is fast.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
```

## Folder structure

```
shopzone/
├── src/
│   ├── components/
│   │   ├── common/         # Generic, reusable across the whole app
│   │   │   ├── Button.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Rating.jsx
│   │   │   ├── PriceTag.jsx
│   │   │   └── SectionHeader.jsx
│   │   ├── layout/          # Shared page chrome
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   ├── product/         # Product-related building blocks
│   │   │   └── ProductCard.jsx
│   │   └── home/            # Home-page-only sections
│   │       ├── HeroBanner.jsx
│   │       ├── PerksStrip.jsx
│   │       ├── CategoryGrid.jsx
│   │       ├── DealsOfTheDay.jsx
│   │       └── TopBrands.jsx
│   ├── data/
│   │   └── products.js      # Mock data — swap for real API calls later
│   ├── pages/
│   │   └── Home.jsx          # Assembles Header + sections + Footer
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css             # Tailwind import + design tokens (@theme)
├── index.html
├── vite.config.js
└── package.json
```

## Design tokens

Brand colors are defined once in `src/index.css` under `@theme`, so every component references
the same palette (`bg-brand-navy`, `text-brand-orange`, `bg-brand-yellow`, etc.) instead of
hard-coded hex values. Update them there and the whole app updates.

## Reusing components for the next pages

- **Category Listing / Search Results**: reuse `ProductCard`, `SectionHeader`, `Rating`,
  `PriceTag`, and `Header`/`Footer`. Add a `FilterSidebar` component alongside a product grid.
- **Product Details**: reuse `Button`, `Badge`, `Rating`, `PriceTag`.
- **Cart / Checkout**: reuse `Button`, `PriceTag`, `Header`/`Footer`; add a `CartLineItem` and
  `OrderSummary` component under `components/cart/`.
- **User Dashboard / Order Tracking / Wishlist / Addresses / Returns**: reuse `Header`/`Footer`,
  `Button`, `Badge`; add a `DashboardSidebar` component under `components/account/`.
- **Admin Dashboard**: this gets its own `AdminLayout` (sidebar + topbar) but can still reuse
  `Button`, `Badge`, and a shared `StatCard` component.

## Next steps (backend)

This repo is frontend-only right now. When you're ready to wire it to a backend:
1. Replace `src/data/products.js` with a `src/services/api.js` that calls your REST/GraphQL API.
2. Add `react-router-dom` and split `App.jsx` into routes, one per page.
3. Add a `CartContext` / `AuthContext` under `src/context/` for global state.

Let me know which page you'd like built next (Category Listing, Product Details, Cart, etc.)
and I'll build it the same way — clean, componentized, matching this design system.
