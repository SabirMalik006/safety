# CarryMe Frontend — React + Vite

Pakistan premium bags e-commerce website ka complete React + Vite frontend.

## 🚀 Setup & Run

### Prerequisites
- Node.js 18+
- npm ya yarn

### Steps

```bash
# 1. Project folder mein jaayein
cd carryme-frontend

# 2. Dependencies install karein
npm install

# 3. Development server start karein
npm run dev

# 4. Browser mein open karein
# http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx       # Top navigation with search, cart, wishlist
│   ├── Navbar.css
│   ├── Footer.jsx       # Full footer with newsletter
│   ├── Footer.css
│   ├── ProductCard.jsx  # Reusable product card with hover effects
│   └── ProductCard.css
├── context/
│   ├── CartContext.jsx    # Global cart state management
│   └── WishlistContext.jsx # Global wishlist state
├── data/
│   └── products.js      # Products, categories, reviews mock data
├── pages/
│   ├── Home.jsx         # Landing page with hero slider
│   ├── Home.css
│   ├── Collections.jsx  # Product listing with filters & sorting
│   ├── Collections.css
│   ├── ProductDetail.jsx # Single product page
│   ├── ProductDetail.css
│   ├── Cart.jsx         # Shopping cart
│   ├── Cart.css
│   ├── Wishlist.jsx     # Saved items
│   ├── Wishlist.css
│   ├── Reviews.jsx      # Customer reviews page
│   └── Reviews.css
├── App.jsx              # Router + context providers
├── index.css            # Global styles + CSS variables
└── main.jsx             # Entry point
```

---

## 🎨 Features

- ✅ **Hero Slider** — Auto-rotating with 3 slides
- ✅ **Product Grid** — Hover effects, color swatches, quick add
- ✅ **Filters** — Color filter, price range, sort by
- ✅ **Product Detail** — Image gallery, color picker, quantity
- ✅ **Shopping Cart** — Add/remove/update quantity, order summary
- ✅ **Wishlist** — Toggle save/unsave items
- ✅ **Search** — Live search dropdown in navbar
- ✅ **Announcement Bar** — Scrolling ticker
- ✅ **Reviews Page** — Customer testimonials
- ✅ **Fully Responsive** — Mobile, tablet, desktop
- ✅ **Pakistani Pricing** — Rs. format throughout

---

## 🔗 Routes

| Path | Page |
|------|------|
| `/` | Home |
| `/collections/all-bags` | All Bags |
| `/collections/best-selling` | Best Sellers |
| `/collections/canvas-bags` | Canvas Bags |
| `/collections/men-wallets` | Men's Wallets |
| `/collections/tote-bag` | Tote Bags |
| `/collections/shoulder-bag` | Shoulder Bags |
| `/products/:slug` | Product Detail |
| `/cart` | Cart |
| `/pages/wishlist` | Wishlist |
| `/pages/reviews` | Reviews |
| `/pages/wholesale` | Wholesale |

---

## 🔧 Backend Integration (MERN)

Jab MERN backend ready ho, in jagahon ko update karein:

1. `src/data/products.js` → Replace with API calls
2. `CartContext.jsx` → Connect to backend cart API
3. Checkout page → Payment gateway integration

Backend API ke liye recommended endpoints:
- `GET /api/products` — All products
- `GET /api/products/:slug` — Single product
- `POST /api/cart` — Add to cart
- `POST /api/orders` — Place order
- `POST /api/auth/login` — User login
