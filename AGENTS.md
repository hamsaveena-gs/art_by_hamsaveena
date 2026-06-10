<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Project: Art by Hamsaveena — AI Context

## What this project is
A production-quality e-commerce art store. Customers browse artworks, add to cart (requires login), and checkout. On successful order an email is sent to the customer via Gmail SMTP. The app is deployed on Vercel.

- **Production URL:** `https://art-by-hamsaveena-hamsaveenas-projects.vercel.app`
- **Dev port:** `localhost:3002` (`npm run dev`)

---

## Tech stack

| Layer | Library / Version |
|---|---|
| Framework | Next.js 16.2.7 (App Router) |
| Language | TypeScript 5 |
| UI | React 19 |
| Styling | Single `src/app/globals.css` — no CSS Modules, no Tailwind utilities in JSX |
| Forms | React Hook Form 7 + Zod v4 (`zod/v4` import path) |
| Cart state | Zustand v5 + `persist` middleware |
| Backend / Auth | Supabase (`@supabase/supabase-js` v2) |
| Email | Nodemailer 8 + Gmail SMTP |
| Testing | Jest 30 + Testing Library React 16 + user-event 14 |

---

## Directory structure

```
src/
  app/                        # Next.js App Router pages & API routes
    globals.css               # ALL custom CSS (single file — never use CSS Modules)
    layout.tsx                # Root layout — includes <Header> and <Footer>
    page.tsx                  # Home page (server component)
    loading.tsx               # Root loading skeleton
    error.tsx                 # Root error boundary ('use client')
    not-found.tsx             # Custom 404
    login/page.tsx            # /login — wraps <LoginForm>
    signup/page.tsx           # /signup — wraps <SignUpForm>
    cart/page.tsx             # /cart — wraps <CartContent>
    checkout/page.tsx         # /checkout — wraps <CheckoutContent>
    checkout/success/page.tsx # /checkout/success
    products/page.tsx         # /products — wraps <ProductsContent>
    products/[id]/page.tsx    # /products/[id] — wraps <ProductContent>
    api/products/route.ts     # GET /api/products
    api/categories/route.ts   # GET /api/categories
    api/orders/route.ts       # POST /api/orders — saves order + sends email

  components/
    Header.tsx                # Thin wrapper: <header><Navbar /></header>
    Footer.tsx
    ui/
      Button.tsx              # Handles both <button> and link-as-button (href prop)
      Heading.tsx             # Replaces all h1–h6; accepts `as` prop
      Input.tsx               # Labelled input with error display; uses useId()
      Select.tsx              # Labelled select; uses useId()
      Text.tsx                # Replaces <p> and <span>; `variant` prop
      Pagination.tsx

  features/
    auth/components/
      LoginForm.tsx           # Supabase signInWithPassword; gold border-top design
      SignUpForm.tsx          # Supabase signUp; mirrors login design; success state
    cart/
      CartContent.tsx         # Full cart page (client)
      components/
        CartItem.tsx
        CartSummary.tsx
      store/
        cartStore.ts          # Zustand store; MAX_QTY=4; persist key 'art-store-cart'
    checkout/
      CheckoutContent.tsx     # Thin wrapper → <CheckoutForm>
      components/
        CheckoutForm.tsx      # Full checkout form; prefills from useUser; sends to /api/orders
        OrderSummary.tsx      # Right panel; free shipping >= ₹150
    home/
      HomeContent.tsx
      components/
        HeroSection.tsx
        HeroTypewriter.tsx    # 'COMMING SOON' typewriter; useReducer; 4-phase animation
        FeaturedProducts.tsx
        CategoryGrid.tsx
    nav/components/
      Navbar.tsx              # Desktop nav; useUser greeting + sign-out; passes props to drawer
      NavDrawer.tsx           # Mobile slide-in; accepts firstName + onSignOut props
      NavLinks.tsx
      NavHamburger.tsx
      CartIcon.tsx
    product/
      ProductContent.tsx
      components/
        AddToCartButton.tsx   # Auth guard: redirects /login if not logged in; size sm/lg
        ProductImages.tsx
        ProductInfo.tsx
        RelatedProducts.tsx
    products/
      ProductsContent.tsx
      components/
        FilterSidebar.tsx     # useReducer accordion; updateFilter pushes router params
        SearchBar.tsx         # useCallback; clears q param on empty input
        ProductCard.tsx
        ProductGrid.tsx
        ProductCardSkeleton.tsx
        ProductGridSkeleton.tsx

  hooks/
    useUser.ts                # Returns { firstName, lastName, email, isLoggedIn, loading }
                              # Seeds from getSession() + stays in sync via onAuthStateChange

  lib/
    supabase.ts               # Lazy getSupabase() singleton + Proxy export
    mapProduct.ts             # Shared DB row → Product mapper (used by server + API)
    products.ts               # Static categories array

  types/
    index.ts                  # Category, CategoryItem, Product, CartItem
```

---

## Database (Supabase)

**Tables in `public` schema:**
- `products` — columns map to `Product` type via `mapProduct.ts`; includes `stock_quantity INTEGER NOT NULL DEFAULT 1`
- `categories` — referenced by `/api/categories`
- `orders` — stores completed orders; columns: `id`, `user_id`, `first_name`, `last_name`, `email`, `phone`, `address`, `city`, `postcode`, `country`, `items` (JSONB), `subtotal`, `shipping`, `total`, `created_at`

**Auth:** Supabase built-in `auth.users`. No custom `public.users` table.
- `first_name` and `last_name` stored in `user_metadata` on `auth.users`
- Access via `session.user.user_metadata.first_name / last_name`

---

## Authentication flow

1. `useUser` hook is the single source of truth — used by Navbar, AddToCartButton, CheckoutForm
2. `AddToCartButton` — `requireAuth(e, action)` helper; if `!isLoggedIn && !loading` → `router.push('/login')`; `loading` guard prevents false redirect before session resolves
3. `CheckoutForm` — `useEffect([loading])` calls `setValue` for firstName/lastName/email once loading flips false
4. `Navbar` — shows "Hi, [firstName]" heading + red "Sign out" pill button when logged in; `handleSignOut` calls `supabase.auth.signOut()` then `router.push('/login')`
5. `NavDrawer` — shows `.nav-drawer-user` section with greeting + sign-out on mobile

---

## Cart store (`cartStore.ts`)

- `MAX_QTY = 4` — `addToCart` returns unchanged state if already at max (line 26)
- Actions: `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, `totalItems()`, `totalPrice()`
- `updateQuantity(id, 0)` removes the item; `updateQuantity(id, qty > 4)` caps at 4

---

## UI conventions

| Instead of | Use |
|---|---|
| `<h1>`–`<h6>` | `<Heading as="h1">` … |
| `<p>`, `<span>` | `<Text variant="muted\|plain\|footnote" as="p\|span">` |
| `<button>`, link-buttons | `<Button variant="primary\|custom" href?="">` |

- `Button` with `href` renders as `<Link>` (Next.js); without renders as `<button>`
- **No Tailwind classes in JSX** — all styling lives in `globals.css`

---

## API routes

| Route | Method | Purpose |
|---|---|---|
| `/api/products` | GET | Fetches all products from Supabase |
| `/api/categories` | GET | Fetches all categories |
| `/api/orders` | POST | Saves order details + sends confirmation email via Nodemailer/Gmail |

Server components query Supabase directly (no HTTP round-trip) using `getSupabase()`.

---

## Email (Nodemailer)

- Provider: Gmail SMTP
- Env vars: `EMAIL_USER`, `EMAIL_PASS` (Gmail app password — include spaces as-is)
- Triggered from `POST /api/orders` — sends two emails: store notification + customer confirmation

## Orders API

`POST /api/orders` flow:
1. Validates payload, calculates totals (shipping free ≥ ₹150, else ₹50)
2. Inserts into `orders` table with user_id from session
3. Decrements `stock_quantity` on each `products` row (matched by name)
4. Sends two non-blocking emails: admin notification + customer confirmation
5. Returns `{ success: true }`

---

## Environment variables (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
EMAIL_USER=...
EMAIL_PASS=xslk miwk htct dmkt
```

---

## Testing

```bash
npm test                  # run all tests
npm run test:watch        # watch mode
npm run test:coverage     # coverage report
```

- Test files live in `test/` (not co-located with source)
- Pattern: `test/**/*.test.{ts,tsx}`
- Coverage collected from `src/**/*.{ts,tsx}` excluding pages, API routes, `supabase.ts`, `layout.tsx`, `not-found.tsx`
- **271 tests, 40 suites** — overall ~87% statement coverage

### Key mock patterns

```ts
// next/navigation
jest.mock('next/navigation', () => ({
  useRouter:       () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams(),
  usePathname:     () => '/',
}));

// useUser hook
jest.mock('@/hooks/useUser', () => ({
  useUser: () => mockUseUser(),
}));

// Supabase
jest.mock('@/lib/supabase', () => ({
  getSupabase: () => ({ auth: { signInWithPassword: mockSignIn } }),
}));

// cartStore (auto-mock then set return value)
jest.mock('@/features/cart/store/cartStore', () => ({ useCartStore: jest.fn() }));
(useCartStore as unknown as jest.Mock).mockReturnValue({ items: [], totalPrice: () => 0, clearCart: jest.fn() });
```

- **Chained timers** (e.g. HeroTypewriter): wrap each `advanceTimersByTime` step in its own `act()` call — a single `act(advanceTimersByTime(N))` only fires the first timer because React must re-render before the next is scheduled.
- **renderHook** is available from `@testing-library/react` v16.

---

## Uncovered files (known gaps)

These are async server components or Next.js skeletons — not practically unit-testable without a different setup:
- `app/loading.tsx`, `app/products/loading.tsx`
- `features/home/HomeContent.tsx`
- `features/product/ProductContent.tsx`
- `features/products/ProductsContent.tsx`

---

## Key decisions & gotchas

- `zod/v4` is the import path (not `zod`) — the package ships v4 under that sub-path
- `getSupabase()` is a lazy singleton wrapped in a Proxy — never call `new` directly
- Card expiry validation uses `.refine()` to reject past MM/YY
- FilterSidebar price labels use `₹` (Unicode) and `–` (en-dash U+2013), not a plain hyphen
- `ProductCard "Sold Out"` text appears twice in the DOM — use `.querySelector('.product-card-sold-out')` in tests
- Both desktop and drawer sign-out buttons are present in the DOM simultaneously
- `NavDrawer` brand text duplicates the Navbar brand — use `getAllByText` not `getByText`
