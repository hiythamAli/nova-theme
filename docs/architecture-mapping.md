# Architecture Mapping — NOVA Docs → Salla Twilight Reality

The 11 NOVA project docs (`/docs`) describe a generic TypeScript + Vite + SCSS
architecture (`/components`, `/pages`, `/layouts` as plain folders). Salla's
actual theme engine, **Twilight**, requires a specific, non-negotiable
structure: server-rendered **Twig** templates, a **twilight.json** manifest,
and fixed page paths. This file records exactly how one maps to the other, so
every future phase stays consistent.

## Why this was necessary

Salla's official docs (docs.salla.dev) confirm:

- Themes are Twig-templated, not client-rendered from `.ts`/`.tsx` files.
- `twilight.json` sits at the repo root and declares theme settings, features
  (pre-built components), and custom components.
- There are 9 predefined pages with **fixed filenames and paths** — a
  developer may edit their contents but not rename or relocate them
  (e.g. Home is always `src/views/pages/index.twig`).
- The default bundler is Webpack, but Twilight explicitly permits any other
  static module bundler — so Vite is compliant.
- `master.twig` is the shared layout and must include specific `{% hook %}`
  blocks (`head:start`, `head`, `head:end`, etc.) for Salla's own injected
  content (SEO tags, tracking scripts, app integrations).

## Folder mapping

| NOVA docs (07-Architecture.md) | Real Salla Twilight path        | Notes |
|---|---|---|
| `/components`                  | `src/scripts/components/` (TS logic) + `src/views/components/` (Twig markup) | Split: TS owns behavior, Twig owns markup/server data |
| `/pages`                       | `src/views/pages/`               | Filenames are fixed by Salla, not by us |
| `/layouts`                     | `src/views/layouts/`             | `master.twig` required |
| `/sections`                    | `src/views/components/home/`     | Salla calls these "Theme Features" / "Theme Components" |
| `/snippets`                    | `src/views/partials/`            | Small reusable Twig includes |
| `/styles`                      | `src/assets/styles/`             | Unchanged — pure SCSS, no Twilight requirement |
| `/hooks`, `/services`, `/utils`, `/config`, `/types` | `src/scripts/{hooks,services,utils,config,types}/` | Unchanged — plain TS, Salla-agnostic |
| `/locales`                     | `src/locales/`                   | `ar.json`, `en.json` as Salla expects |
| N/A                            | `twilight.json` (root)           | New — required by Salla, not in original docs |

## What stayed identical

- Design Tokens (`09-Design-Tokens.md`), Brand System, UI System, and Coding
  Standards are 100% platform-agnostic and apply unchanged.
- The Development Roadmap phase order is unchanged; only *where* files land
  changes, not *what* gets built in each phase.
- TypeScript strictness, ESLint/Prettier rules, and the component-per-folder
  convention are preserved for everything under `src/scripts/`.

## Verified in Phase 3 (Core Layout) research

- Header components live at `src/views/components/header/`: `header.twig`
  (wraps breadcrumbs + menu), `advertisement.twig` (announcement bar),
  `breadcrumbs.twig`, `menu.twig`, `menu-item.twig`.
- Footer components live at `src/views/components/footer/`: `footer.twig`
  (wraps contacts, payment-methods, social), `contacts.twig`,
  `mobile-app.twig`, `menu.twig`, `payment-methods.twig`, `social.twig`.
- Confirmed template hooks (docs.salla.dev/422552m0): `head:start`, `head`,
  `head:end`, `body:classes`, `body:start`, `body:end`, plus auto-generated
  `component:{path}.start` / `component:{path}.end` for every rendered
  component. Master layout previously used two invented hooks
  (`content:start`/`content:end`) — removed.
- Salla Icons library must be linked in `<head>` from
  `https://cdn.salla.network/fonts/sallaicons.css`, class prefix `sicon-`.
- Confirmed data shapes: `breadcrumbs` (array of `{title, url}`), `menus`
  (array of menu items), `advertisement` (`.icon`, `.url`, `.description`),
  `contacts` / `apps` / `items` / `payment_methods` / `links` (footer arrays).

## Open items requiring official docs before implementation

- **Global Variables reference** (docs.salla.dev/421938m0) renders its
  variable table client-side via JS, which couldn't be retrieved by static
  fetch. `page_title`, `page_description`, `store.name`, `store.logo`,
  `store.description`, `store.whatsapp`, `cart.count` are best-effort names
  inferred from surrounding context, not confirmed. Every file using them
  has an inline comment flagging this. Verify against a real theme's
  rendered output or the JS-rendered docs page before shipping.
- **`link()` / `cart_url()` helpers** (Twilight-flavoured Twig helpers,
  docs.salla.dev/421929m0): the doc confirms a link-building helper exists
  and that a cart-URL-producing helper exists, but the exact function
  names/signatures weren't captured. Flagged inline in `header.twig`.
- **Theme Feature slugs** for `twilight.json`'s `features` array (e.g. the
  exact string for "Testimonials" or "Photos slider") — left empty rather
  than guessed; select via Partners Portal's component picker, which syncs
  the correct slugs back into this file automatically.
- Menu item child/product field names (`item.children` vs some other key)
  — inferred structure in `menu-item.twig`, flagged inline.

## Verified in Phase 5 (Commerce Components) research

- Confirmed official Twilight JS Web Components (docs.salla.dev/422688m0,
  422692m0): `<salla-add-product-button>`, `<salla-quantity-input>`,
  `<salla-product-availability>`, `<salla-product-card>`,
  `<salla-products-list>`, `<salla-cart-summary>`, `<salla-breadcrumb>`,
  `<salla-color-picker>`, and more. NOVA's product card uses
  `<salla-add-product-button>` for cart/stock logic rather than
  reimplementing that state machine — confirmed to internally handle sold
  out / notify-me / add-to-cart via `product-status`/`product-type`
  attributes.
- Confirmed `salla.cart.addItem({ id, quantity })` method signature and
  event pattern `salla.event.{module}.{action}()`, e.g.
  `salla.event.wishlist.onAdded((response, product_id) => ...)`.
- Theme Raed's reference partial structure confirmed:
  `partials/product/card.twig`, `card-mini.twig`, `card-full-image.twig`,
  `options.twig`, `slider.twig` — NOVA's three product card variants use
  this exact naming.

## Open items from Phase 5

- **Wishlist add/remove method names** — the SDK's Wishlist API module is
  confirmed to exist, and `salla.event.wishlist.onAdded` is confirmed as
  the completion event, but the method to *call* (`addItem`/`add`/
  `toggle`) was never confirmed. `Wishlist.ts` uses `addItem`/`removeItem`
  by analogy with the confirmed `cart.addItem` signature — verify against
  the live SDK reference before shipping.
- **Compare** — no official Salla API or web component was found for this
  feature anywhere in the Web Components reference. Implemented as a
  genuinely client-side, localStorage-only NOVA feature instead of
  guessing at a non-existent Salla API.
- **Product/category/brand object field names** (`product.price`,
  `product.on_sale`, `category.products_count`, `brand.logo`, etc.) —
  the Products Listing / Single Product / Categories reference pages
  render their variable tables client-side; every partial using these
  has an inline comment flagging them as inferred, not confirmed.

## Verified in Phase 6 (Homepage) research

- Confirmed exact `twilight.json` `features` slugs (docs.salla.dev/421921m0):
  `component-featured-products`, `component-fixed-banner`,
  `component-fixed-products`, `component-photos-slider`,
  `component-products-slider`, `component-parallax-background`,
  `component-random-testimonials`, `component-testimonials`,
  `component-square-photos`, `component-store-features`,
  `component-youtube`, `filters`. NOVA enables the subset matching
  05-Pages.md's homepage sections; the rest are left available but unused.
- No official feature slug covers Featured Categories, Featured Brands,
  Instagram Feed, or Newsletter — these are registered as custom Theme
  Components in `twilight.json` instead (`nova-categories-grid`,
  `nova-brand-strip`, `nova-instagram-feed`, `nova-newsletter`), which is
  the documented, sanctioned way to add homepage sections beyond the
  built-in features.
- `{% component home %}` (already in master.twig since Phase 1) is
  confirmed to render both Theme Features and Theme Components together
  in the order the merchant arranges them in the Salla admin — NOVA's
  `index.twig` needed no changes this phase.

## Open items from Phase 6

- Newsletter subscribe has no confirmed Salla endpoint in any doc
  consulted — `Newsletter.ts` has an explicit TODO rather than a guessed
  `fetch()` call.
- Instagram Feed is static merchant-uploaded images, not a live API pull —
  no Instagram/Salla integration for this was confirmed.

## Verified in Phase 7 (Category/Listing Pages) research

- **No separate Category Page exists.** 05-Pages.md (NOVA's own docs)
  describes a standalone Category Page template, but Salla's confirmed
  architecture (docs.salla.dev/422559m0) unifies Category, Offers, Tags,
  and Search-result contexts into a single template:
  `src/views/pages/product/index.twig`. NOVA's "Category Page" is built
  as this one file, distinguished at runtime by the confirmed `page.title`
  variable rather than by a separate route/template.
- Confirmed variables: `products` (the listing's product collection,
  loopable — confirmed by the docs' description, `product`/card fields
  within it still unverified per Phase 5's note), `sort_list` (array of
  sort-method objects), `page.title`.
- Confirmed `"filters"` as a real `twilight.json` feature slug (already
  enabled since Phase 6), but the exact `filters` variable shape it
  injects wasn't confirmed — NOVA builds its own filter sidebar UI using
  an inferred `filters` object instead, flagged inline in
  `filters-sidebar.twig`.
- `pagination.links`/`.active` (Laravel-style paginator) used in
  `pagination.twig` is inferred from being common across Salla's stack,
  not explicitly confirmed — flagged inline.

## Verified in Phase 8 (Single Product Page) research

- Confirmed fixed path and fields (docs.salla.dev/422561m0):
  `product.promotion_title`, `product.brand`, `product.name`,
  `product.rating`, `product.subtitle`, `product.description`,
  `product.tags`, `product.images` (loopable), `product.options`
  (loopable). This also retroactively confirmed a Phase 5 bug: the
  listing page's field is `product.image.url` (an object), not
  `product.image` as a plain string — fixed across all three card
  variants and `menu-item.twig`.
- Confirmed hooks `product:single.form.start` / `product:single.form.end`
  wrap the options/price/quantity form — the doc's own wording about
  exactly what falls inside was somewhat self-contradictory (see inline
  note in `options.twig`), so the more defensible reading was used.
- Confirmed the page shows a `product.offer` component and a `comments`
  component for reviews, but not their exact Twig call syntax — used the
  standard `{% component %}` tag as the defensible interpretation.
- `product.options` rendering delegates to the confirmed
  `<salla-product-options>` web component rather than hand-building every
  option type (dropdown, swatch, text) from an unconfirmed field shape.

## Open items from Phase 8

- Exact syntax for invoking `product.offer` and `comments` components not
  confirmed — flagged inline in `single.twig`.
- `product.images[].url`, `product.brand.url`/`.name`, `product.tags[].name`
  assumed by analogy with confirmed listing-page shapes, not separately
  confirmed for the single-product context.

## Phase 10 (Theme Settings) — schema correction and completion

**Critical correction**: the `settings` array built in Phase 1 used an
invented `{type:'group', fields:[...]}` nested schema. The actual
confirmed schema (docs.salla.dev/421921m0, seen in a real example) is a
**flat array** of field objects: `type` (Partners Portal supports exactly
four: String, Numeric, Boolean, List), a `format` refiner (e.g.
`format:'switch'`, `format:'hidden'`), and the default-value key depends
on type — boolean uses `selected`, string uses `value`. Rebuilt the whole
array against this schema and updated every `theme.settings.get(...)`
call across the codebase to match the renamed, prefixed ids
(`general_primary_color`, `header_sticky_header`, etc.). Color/image
field shapes (`format:'color'`/`format:'image'`) are inferred by
extending the confirmed type+format pattern, not separately confirmed.

**37 settings declared**, covering every section in 06-Theme-Settings.md
that has a corresponding built page/component. Most are mechanically
wired into real template/CSS/TS behavior, not just declared:

- Colors, sticky/transparent header, announcement bar, smooth scroll,
  page loader (new `PageLoader.ts`, fades out on window `load`),
  animations on/off (layered on top of — never replacing — the browser's
  own `prefers-reduced-motion` query)
- Hero autoplay + speed (reads via data attributes, `Hero.ts` updated)
- Product card style/image-ratio/quick-view/quick-add
- Product page: sticky gallery, sticky buy bar, trust badges (new)
- Category page: sidebar filters, products-per-row
- Cart: free shipping bar, coupon field
- Footer: social links, payment icons visibility
- Typography: heading font, uppercase nav
- Advanced: custom CSS/JS injection in `master.twig`

**Deliberately left declared-only** (setting exists in `twilight.json`
but no matching UI was built to wire it to), each for a documented
reason rather than silently incomplete:
- `popup_enable`/`popup_delay_seconds`/`popup_exit_intent` — the Popup
  System UI component itself was never built in any earlier phase
  (04-Components.md lists it, but no phase built it); wiring a setting
  to nonexistent markup would be meaningless. Needs a UI component pass
  first.
- `category_infinite_scroll` — no infinite-scroll pagination JS exists;
  the built pagination is link-based (`pagination.twig`). Wiring this
  toggle would need that JS built first.
- `performance_lazy_loading` — every image in the theme already has a
  hardcoded `loading="lazy"`/`loading="eager"` (first-slide/above-fold
  exception) chosen deliberately per element; a global toggle would need
  a Twig-level conditional threaded through every single `<img>` tag
  project-wide for a setting whose default (on) matches best practice
  anyway.
- `a11y_reduced_motion_respect` — deliberately **not** wired as a
  literal on/off for honoring the visitor's OS-level
  `prefers-reduced-motion` preference. Letting a theme setting allow a
  merchant to defeat a visitor's own accessibility preference would
  contradict the accessibility-first principle in every project doc.
  The setting is declared for Partners Portal completeness but the CSS
  media query it might have gated remains unconditional in
  `base/_reset.scss` and `animations/*` — this is a deliberate product
  decision, documented rather than silently ignored.
- `general_enable_dark_mode` — explicitly labeled "(Future)" in
  06-Theme-Settings.md itself; `themes/_light.scss` already has a
  reserved, commented scope for this from Phase 2.

## Phase 11 (Responsive) — audit findings

Ran a targeted grep-based audit across every SCSS file rather than
rebuilding from scratch, since the theme was built mobile-first with
logical properties throughout every prior phase:

- **Zero** raw `left`/`right` physical properties found (only correct
  `inset-inline-*`/`margin-inline-*`/`border-inline-*` usage) — RTL
  support via logical properties held up across all 10 prior phases.
- **Zero** `max-width` media queries found — the "mobile-first, min-width
  only" rule from the UX Rules doc was never violated.
- **Zero** `float` usage.
- Every `translateX`-based transform (toggle switch, tooltip, cart
  drawer) already had a `[dir='rtl']` counterpart rule where direction
  actually matters (drawer slide side, tooltip pointer offset). The one
  exception — the skeleton-loading shimmer sweep — is purely decorative
  and direction-agnostic in meaning, left as-is.
- **Real gap found and fixed**: the `wide`/`ultra-wide` breakpoint
  tokens (1440px/1600px, declared since Phase 2 per 09-Design-Tokens.md)
  were never actually consumed anywhere — large monitors just got more
  empty side margin forever, with no denser grid or wider container.
  Added a `nova-col-wide-*` grid-column generator and a `'3xl'` (1520px)
  container ceiling that only activates at the `wide` breakpoint,
  applied to every product grid (listing, wishlist, brand, related
  products) so they go from 4 to 6 columns on very large screens instead
  of just spreading out with more whitespace. The `'3xl'` container size
  is a NOVA addition beyond 09-Design-Tokens.md's original five-size
  list, added specifically to satisfy the Ultra Wide requirement in
  05-Pages.md's Responsive Breakpoints section.

## Phase 12 (Performance) — two real findings, both fixed and measured

**1. Code splitting (Dynamic Imports).** `main.ts` statically imported
every interactive component (Dropdown, Accordion, Tabs, Modal, Drawer,
Wishlist, Compare) into one bundle loaded on every page, none of it
needed for first paint. Split into a critical tier (PageLoader, Navbar,
FloatingButtons — stays in `main.js`) and a deferred tier, dynamically
imported via `import('./deferred')` and run on `requestIdleCallback`
(with a `setTimeout` fallback for Safari) so it never competes with the
critical rendering path. Confirmed via a real production build: this
alone produced a genuine separate chunk (`dist/chunks/deferred.*.js`,
~5.5KB), not just smaller numbers on paper.

**2. Unused dependency (much bigger finding).** While rebuilding for the
above, `main.js`'s size didn't add up — grepped every Twig template in
the theme for any Alpine.js directive (`x-data`, `x-show`, `x-bind`,
`x-on`, `x-model`, `x-if`, `x-for`, `x-transition`) and found **zero
matches anywhere**. Alpine.js had been imported and `Alpine.start()`'d on
every page since Phase 1 (per the original tech stack docs), but every
single interactive component across all 11 prior phases was actually
built with plain TypeScript + data attributes instead — Alpine was 100%
dead weight, and it was the dominant share of the bundle.

Removed it entirely (`package.json` dependency, `@types/alpinejs`
devDependency, the import/init in `main.ts`). Measured, clean-install,
real production build, before → after:

| | Before | After |
|---|---|---|
| `main.js` (minified) | 48.23 KB | **2.31 KB** |
| `main.js` (gzip) | 17.57 KB | **1.19 KB** |

A 95% reduction in the one JS file every single visitor downloads and
parses, on every page. This is exactly the kind of thing this phase
exists to catch. Re-adding Alpine is a one-line change if a future
component genuinely needs declarative reactivity driven straight from
Twig markup — but it shouldn't be paid for unused.

**3. Already in place from earlier phases, confirmed still working**:
image optimization (`vite-plugin-image-optimizer`, Phase 1), per-image
`loading="lazy"`/`loading="eager"` (first-slide/above-fold exception)
chosen deliberately throughout, `esbuild` minification, and Vite/Rollup's
automatic tree-shaking (implied by how small every chunk is — no
unreferenced code inflating bundles).

**4. Critical CSS** — not implemented as an extraction build step.
Reasoned decision, not an oversight: real critical-CSS tooling (e.g.
critters/beasties) needs to run against actual rendered HTML to know
which selectors are above-the-fold, which isn't available in this
environment (no live Salla store to render against), and getting it
wrong (extracting the wrong critical set) actively hurts performance
worse than not doing it. `main.css` is already a single, small
(48KB/8.5KB gzip) non-render-blocking-in-practice file — the bigger win
available without that infrastructure was the JS reduction above.

**5. Caching Strategy** — this is a hosting/CDN-level concern, not
something a theme's Twig/JS controls directly. Salla serves themes
through its own CDN/versioning; whether `asset()`-resolved URLs get
automatic cache-busting on redeploy wasn't confirmed in any doc consulted
this session. Deliberately did *not* add content hashes to `main.js`/
`main.css`'s filenames to "solve" this myself, since `master.twig`
references them by fixed name (`'main.js' | asset('dist')`) — hashing
them without confirmed manifest-based resolution support in Salla's
`asset()` filter would silently break every asset link rather than
improve anything. Flagged as an open platform question rather than
guessed at destructively.

## Verified in Phase 9 (Other Pages) research — major findings

- **Confirmed the complete official page list** (docs.salla.dev/422556m0):
  Home; Product Pages (Single product, Products listing); Customer Pages
  (Profile, Orders list, Order details, Wishlist, Notifications); Blog
  Pages (Blog listing, Single blog); Brand Pages (Brands listing, Single
  brand); Common Pages (Cart, Loyalty, Thank you, **Single page**);
  Landing Page. Notably: **no 404 or Maintenance page appears in this
  list.** 05-Pages.md assumes both exist as theme-rendered templates —
  that's now in question; may be platform-level instead of theme-level.
  Flagged rather than built on a guess.
- **No separate About/Contact/Policies templates exist.** These are all
  the same confirmed generic **"Single page"** Common Page type. NOVA
  builds this once (`src/views/pages/page.twig`, filename inferred — not
  given verbatim) rather than four divergent guessed templates.
- Confirmed real source: `github.com/SallaApp/theme-raed/blob/master/src/views/pages/cart.twig`
  — a complete official theme file with a full variable table in its own
  header comment. This resolved several previously-flagged uncertainties
  at once: confirmed `cart.items[]` fields (`.id`, `.url`, `.quantity`,
  `.product_name`, `.product_image`, `.price`, `.total`,
  `.total_special_price`, `.is_available`, `.max_quantity`,
  `.detailed_offers`, `.offer`), `cart.free_shipping_bar` (`.percent`,
  `.remaining`, `.has_free_shipping`), `cart.options[]`; confirmed hooks
  `cart:items.start/end`, `cart:summary.start/end`, `cart:coupon.start/end`,
  `cart:summary-card.start/end`; confirmed web components
  `salla-cart-item-offers`, `salla-button`, `salla-offer`,
  `salla-cart-coupons`, `salla-cart-summary-card`, `salla-conditional-offer`;
  and confirmed **JS SDK call syntax**:
  `salla.form.onChange('cart.updateItem', event)` and
  `salla.cart.deleteItem(id).then(...)`. Also confirmed `trans()` accepts
  a params object as its second argument for interpolation, and several
  exact Salla-default translation keys (`pages.cart.total`,
  `pages.cart.out_of_stock`, `pages.cart.empty_cart`,
  `pages.cart.free_shipping`, `common.elements.back_home`,
  `blocks.header.cart`) — NOVA's cart.twig now uses these directly instead
  of redundant custom keys.
- **`link()` now confirmed** (seen verbatim as `link('/')` in the same
  reference file) — the earlier Phase 3 flag on this helper is resolved.
- **`<salla-search>` confirmed** (docs.salla.dev/422730m0): a
  self-contained Modal+Button+slots web component for site search.
  Replaced NOVA's earlier custom search-toggle button in `header.twig`
  with this — no NOVA-side search page/modal logic needed for the basic
  case.
- Confirmed `src/views/pages/customer/wishlist.twig` path and that its
  `products` variable is the same Paginator shape as the listing page's.
- Confirmed `src/views/pages/brands/index.twig` path for Brands listing.

## Scope triage for Phase 9 — RESOLVED, Phase 9 now complete

A follow-up request asked to finish every officially-supported page. Found
the **definitive source**: `SallaApp/theme-raed`'s own README on GitHub
includes its literal directory tree, which settles every remaining
question definitively rather than by inference:

```
src/views/pages/
  cart.twig, index.twig, loyalty.twig, page-single.twig, thank-you.twig
  blog/index.twig, blog/single.twig
  brands/index.twig, brands/single.twig
  customer/notifications.twig, profile.twig, wishlist.twig
src/views/components/comments.twig   (top-level, not nested)
```

This resolved things precisely:
- **Corrected a filename error**: NOVA's generic content page was built
  as `page.twig` (an inferred guess) — the confirmed exact name is
  `page-single.twig`. Renamed.
- **`comments.twig` is top-level** (`src/views/components/comments.twig`),
  not nested under `product/` as guessed in Phase 8 — the `{% component
  comments %}` call in `single.twig` was already correct either way since
  it referenced the component by name, not a path.
- **Confirmed: no `404.twig` or `maintenance.twig` exists anywhere in the
  official directory structure.** 05-Pages.md (NOVA's own docs) assumed
  both as theme-rendered pages. Per this project's explicit instruction
  to prioritize official Salla compatibility over the original
  assumptions: **neither was built.** If a not-found state needs
  showing (e.g. an expired Landing Page offer), the confirmed mechanism
  is inline conditional rendering within the relevant template, not a
  separate routed page — as seen in the Landing Page docs' note that "the
  developer may show the 404 not found error page" when its `landing`
  object isn't received (handled inline, not via a route).
- Landing Page itself (confirmed to exist, receives a `landing` object)
  was not built this pass — genuinely lower priority than the pages
  above and still open for a future pass if needed.

All remaining confirmed pages built this pass: Thank You, Loyalty, Blog
listing/single, Single brand, Notifications, Profile, Orders list/details
(the orders index path's exact filename wasn't given verbatim — inferred
from the confirmed sibling `orders/single.twig` and the index/single
pairing used everywhere else). Every new page has inline
VERIFICATION-NEEDED comments for field names not covered by a confirmed
variable table.

## Phase 10 (Theme Settings) — schema correction

**Critical correction**: the `settings` array built in Phase 1 used an
invented `{type:'group', fields:[...]}` nested schema. The actual
confirmed schema (docs.salla.dev/421921m0) is a **flat array** of field
objects: `type` (Partners Portal supports exactly four: String, Numeric,
Boolean, List), a `format` refiner (e.g. `format:'switch'`), and the
default-value key depends on type — boolean uses `selected`, string uses
`value`. Rebuilt the whole array against this schema and updated every
`theme.settings.get(...)` call across the codebase to match renamed,
prefixed ids (`general_primary_color`, `header_sticky_header`, etc.).

41 settings declared, most wired to real behavior (colors, sticky/
transparent header, announcement bar, page loader, animation on/off,
hero autoplay, card style/ratio/quick-view/quick-add, product sticky
gallery/buy-bar/trust-badges, category sidebar filters/products-per-row,
cart free-shipping-bar/coupon, footer social/payment visibility,
typography heading-font/uppercase-nav, advanced custom CSS/JS). A few
declared-only with documented reasoning: popup settings (no Popup UI
component was ever built to wire them to), category infinite-scroll (no
infinite-scroll JS exists), `a11y_reduced_motion_respect` (deliberately
not wired as an override — a theme setting must never be able to defeat
a visitor's own OS-level accessibility preference).

Full validation performed: SCSS zero warnings, TypeScript zero errors,
a real `npm run build` succeeds end-to-end, all JSON valid, all settings
programmatically schema-checked (zero duplicates, zero invalid types).
That real build caught two bugs a syntax-only check would've missed:
`dist/style.css` didn't match what `master.twig` linked (`main.css`) —
fixed the Vite asset naming; and `@types/alpinejs` had been installed
ad-hoc for every validation pass all session without ever actually being
added to `package.json` — fixed.

## Phase 11 (Responsive) — audit findings

Grep-based audit across every SCSS file: zero raw `left`/`right`
physical properties, zero `max-width` media queries, zero floats — RTL
via logical properties and mobile-first held up across 10 prior phases
without a single violation. Every direction-sensitive `translateX`
already had its `[dir='rtl']` counterpart.

Real gap found and fixed: the `wide`/`ultra-wide` breakpoint tokens
(declared since Phase 2) were never actually consumed anywhere — large
monitors just got more empty margin forever. Added a `nova-col-wide-*`
grid generator and a new `3xl` (1520px) container ceiling, applied to
every product grid, so they go 4→6 columns on very large screens instead
of just spreading out with whitespace.

## Phase 12 (Performance) — two findings, one much bigger than expected

**1. Code splitting**: `main.ts` statically imported every interactive
component regardless of page need. Split into a critical tier (stays in
`main.js`) and a deferred tier, dynamically imported via
`import('./deferred')` on `requestIdleCallback`. Confirmed via real
production build — produces a genuine separate chunk.

**2. Unused dependency**: while checking why `main.js` still felt heavy,
grepped every Twig template for any Alpine.js directive (`x-data`,
`x-show`, `x-bind`, `x-on`, `x-model`, `x-if`, `x-for`, `x-transition`).
**Zero matches anywhere.** Alpine had been imported and started on every
page since Phase 1 per the original tech stack docs, but every
interactive component across all 11 prior phases was actually built
with plain TypeScript instead. Removed it. Measured, clean-install, real
build, before → after: `main.js` minified 48.23 KB → **2.31 KB**, gzip
17.57 KB → **1.19 KB** — a 95% reduction in the one file every visitor
downloads on every page.

Critical CSS extraction was deliberately not implemented (needs real
rendered HTML to target correctly, unavailable in this environment —
getting it wrong hurts more than skipping it). Caching strategy is a
Salla CDN-level concern; deliberately did not add content hashes to
`main.js`/`main.css` filenames since `master.twig` references them by
fixed name and hashing without confirmed manifest-based resolution
support in Salla's `asset()` filter would silently break every asset
link.

## Phase 13 (SEO) — key finding and what was built

**Key finding**: the confirmed Master Layout docs (docs.salla.dev/421944m0)
state the `head:start`/`head`/`head:end` hooks (already in `master.twig`
since Phase 1) are "responsible for adding the SEO-related meta data" —
Salla's platform injects a layer of SEO content through those hooks
automatically (verification tags, tracking, app integrations). This does
**not** replace a theme authoring its own per-page `<title>`/Open
Graph/Twitter Card tags — hooks are additive injection points, not a
replacement, consistent with every other confirmed hook in this theme
(e.g. `product:single.form.start/end` wraps content, doesn't replace it).

Built:
- `partials/seo.twig` — Open Graph, Twitter Card, canonical link, robots
  meta. OG/Twitter image falls back through the confirmed
  `product.images[0].url` (Phase 8), then `store.logo`.
- `partials/structured-data/breadcrumbs.twig` — BreadcrumbList JSON-LD
  using the confirmed `breadcrumbs` array (Phase 3).
- `partials/structured-data/product.twig` — Product JSON-LD using
  confirmed fields (`.name`, `.description`, `.images`, `.rating`);
  `.price`/`.is_available` inferred by convention, flagged inline.
- `partials/structured-data/organization.twig` — Organization + WebSite
  JSON-LD on the home page.
- All three gated behind the already-declared `seo_enable_structured_data`
  setting.
- `robots_directive` — a settable Twig variable (not a blunt sitewide
  toggle) so private pages (Cart, Wishlist, Profile, Notifications,
  Orders, Thank You) opt into `noindex, nofollow` individually; every
  public page defaults to `index, follow`.
- Used a plain `{% for %}` + `merge()` accumulator for JSON-LD arrays
  instead of Twig 3's arrow-function `map()` syntax, since Twilight's
  exact Twig version wasn't confirmed and the loop is universally
  compatible.

**Not built**: `sitemap.xml`/`robots.txt` — neither appears in the
confirmed 9-page list or the theme-raed directory structure; almost
certainly platform-generated by Salla at the domain level, the same
reasoning that excluded 404/Maintenance in Phase 9.

## Phase 14 (Accessibility) — measured, real contrast failures found and fixed

Computed exact WCAG contrast ratios (sRGB relative luminance formula)
for every design-token color pair actually used as text/foreground
against the backgrounds it appears on, rather than eyeballing it:

- **`text-light` (#999999)**: measured 2.68–2.85:1 depending on
  background. WCAG AA requires 4.5:1 for normal text, 3:1 even for large
  text — this failed both, everywhere it was used (category product
  counts, footer description, timestamps, breadcrumb text). Both
  02-Brand-System.md and 09-Design-Tokens.md list "WCAG AA" / "Contrast
  Compliance" as explicit Accessibility targets in their own sections —
  this is a real conflict between an exact specified hex value and an
  explicit compliance requirement in the same docs. Resolved in favor of
  the compliance requirement: corrected to **#767676** (4.54:1, the same
  "muted gray" family, a value also used by other accessible design
  systems for exactly this reason).
- **`accent` (#C7A76C)**: measured 2.29:1 against white — fails WCAG AA
  even for large text, and fails the 3:1 non-text/UI-component minimum
  (WCAG 1.4.11) that applies to focus rings, borders, and icon glyphs.
  This affected the *default global focus ring* (`:focus-visible` in
  `base/_reset.scss`) used by every focusable element site-wide with no
  more specific override, plus links, active-tab borders, swatch focus
  rings, and white-text-on-accent buttons/badges.

  Fix preserves the exact spec'd accent hex unchanged for backgrounds/
  decorative fills (buttons, badges, toggle switch), where it's still
  used exactly as documented. Two changes instead:
  1. White text on accent backgrounds (`.nova-btn--accent`,
     `.nova-badge--accent`, header cart-count badge) switched to
     `text-primary` (dark) — 8.25:1, without changing the accent color
     itself at all.
  2. Added `accent-text` (#96702F, 4.51:1 against white) — a darker
     same-family gold — for every place accent needs to work as its own
     foreground: links, focus rings, active-state borders, icon glyphs.
     The global `:focus-visible` outline now reads
     `var(--nova-color-accent-text)` instead of the raw (and
     merchant-editable via Theme Settings) `--nova-color-accent` — a
     merchant customizing their brand accent color can no longer
     accidentally break every focus indicator sitewide, since the
     accessibility-critical default routes through a fixed value.
     Documented limitation: a merchant who sets a genuinely
     low-contrast custom primary/secondary/accent combination via
     Theme Settings can still reduce contrast elsewhere in the theme —
     that's outside what a theme's own build-time tokens can guarantee.
- **Swatch accessible names**: both color-swatch implementations
  (product page variant picker, category filter sidebar) relied solely
  on the `title` HTML attribute to convey the color's name to assistive
  technology. `title` is not reliably part of accessible-name
  computation across browser/screen-reader combinations — this was a
  real WCAG 4.1.2 (Name, Role, Value) gap; a screen reader user could
  land on a color radio button with no way to know which color it was.
  Fixed by adding a `.nova-visually-hidden` text span with the color
  name inside each label (the swatch's accessible name now comes from
  real text content) and marking the decorative color circle
  `aria-hidden="true"`.

Everything else audited clean: no images missing `alt`, every form
input properly wrapped in an associated `<label>`, `prefers-reduced-
motion` respected throughout (confirmed again in Phase 11), keyboard
focus trapping already correct in Modal/Drawer (Phase 4), Tabs already
implementing the full WAI-ARIA pattern with RTL-aware arrow-key
navigation (Phase 4).

## Phase 15 (Testing) — tools that were configured but never actually run

The most important finding this phase wasn't a code bug — it was that
several tools had been *configured* since early phases and assumed
working, but never actually *exercised*:

- **ESLint had literally never been run this entire project.** First
  run in Phase 15 caught two real issues: an unsafe `any` assignment in
  `i18n.ts` from an unvalidated `JSON.parse` result, and a missing
  return type in `main.ts`. Both fixed.
- **`package.json`'s own `lint` script was broken since Phase 1** — it
  used the legacy `eslint --ext .ts` flag, incompatible with the flat
  `eslint.config.js` set up in that same phase. Anyone who ran
  `npm run lint` as documented would have hit an error instead of a
  lint report. Fixed.
- **Prettier found 3 inconsistently-formatted files** on its first
  actual run.
- **No `.twig` file had ever been syntax-checked mechanically** — 51
  templates had been hand-written across 14 phases, trusted on
  read-through alone. Installed `twig` (a Node.js Twig implementation)
  and wrote `scripts/validate-twig.cjs`, which strips Salla's two
  custom tags (`hook`, `component` — the only genuinely non-standard
  Twig syntax used anywhere) to harmless comments before parsing, so it
  validates real Twig syntax (balanced blocks, valid expressions,
  correct filter chains) without false-failing on Salla-specific
  extensions twig.js doesn't know about. Result: 51/51 pass. Added as a
  permanent `npm run validate:twig` script and folded into a new
  `npm run validate` that chains typecheck → lint → format:check →
  Twig validation → production build, so this can't silently regress
  again.

Wrote `docs/TESTING.md` — an honest accounting of what's been
mechanically verified (the table above, plus Phase 11's RTL/mobile-first
audit and Phase 14's computed contrast ratios) versus what genuinely
requires a live Salla store, real browsers, or Partners Portal access
that this environment doesn't have (cross-browser rendering, RTL visual
QA with real Arabic content, the Theme Settings UI actually rendering
correctly in Partners Portal, runtime behavior of the Twilight Web
Components, and the 17 files still carrying `VERIFICATION NEEDED` flags
for field names inferred rather than confirmed). Recommends running
`salla theme preview` against a demo store as the next concrete step.



