# Art by Hamsaveena

A production-quality e-commerce art store built with Next.js 16 App Router. Customers browse original artworks across six categories, add items to a persistent cart (login required), and complete checkout. A confirmation email is sent via Gmail SMTP on every successful order.

**Live:** https://art-by-hamsaveena-hamsaveenas-projects.vercel.app

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.2.7 (App Router) |
| Language | TypeScript 5 |
| UI | React 19 |
| Styling | Single `globals.css` — no Tailwind in JSX, no CSS Modules |
| Forms | React Hook Form 7 + Zod v4 |
| Cart state | Zustand v5 + `persist` middleware |
| Backend / Auth | Supabase (Postgres + Auth) |
| Email | Nodemailer 8 + Gmail SMTP |
| Testing | Jest 30 + Testing Library React 16 |

---

## Getting started

```bash
# Install dependencies
npm install

# Start dev server on port 3002
npm run dev
```

Open [http://localhost:3002](http://localhost:3002).

### Environment variables

Create `.env.local` in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

> Gmail app password: generate one at **Google Account → Security → App passwords**. Paste it including spaces.

---

## Project structure

```
src/
  app/              Next.js App Router pages + API routes
  components/       Shared UI primitives (Button, Heading, Input, Select, Text)
  features/         Feature slices — auth, cart, checkout, home, nav, product, products
  hooks/            useUser — single source of truth for auth state
  lib/              supabase singleton, mapProduct mapper, static categories
  types/            Category, Product, CartItem interfaces
test/               Jest test files (co-located with src is not used)
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, featured products, category grid |
| `/products` | Shop — filter by category/price, search, pagination |
| `/products/[id]` | Product detail — images, info, add to cart, related |
| `/cart` | Cart — item list, quantity controls, summary |
| `/checkout` | Checkout — shipping + payment form, order summary |
| `/checkout/success` | Order confirmation |
| `/login` | Sign in |
| `/signup` | Create account |

---

## API routes

| Route | Method | Purpose |
|---|---|---|
| `/api/products` | GET | Fetch all products from Supabase |
| `/api/categories` | GET | Fetch all categories |
| `/api/orders` | POST | Save order + send confirmation email |

---

## Running tests

```bash
npm test                # run all tests
npm run test:watch      # watch mode
npm run test:coverage   # coverage report
```

**271 tests · 40 suites · ~87% statement coverage**

---

## Deployment

The app is deployed on Vercel. Every push to `main` triggers a production deploy.

```bash
vercel --prod   # manual deploy (requires Vercel CLI)
```

Make sure all four environment variables are set in the Vercel project settings.

---

## Art categories

Painting · Clay Art · Canvas Art · Postcard Art · Sketching · Digital Art
