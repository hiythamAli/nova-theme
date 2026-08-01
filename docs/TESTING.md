# NOVA Theme — Testing Report

## How to run everything

```bash
npm run validate
```

Runs, in order: TypeScript typecheck → ESLint → Prettier format check →
Twig syntax validation → production build. All five must pass clean.
Individual commands (`npm run typecheck`, `lint`, `format:check`,
`validate:twig`, `build`) are also available separately.

## Automated checks — run and passing as of Phase 15

| Check | Tool | Result |
|---|---|---|
| TypeScript strict typecheck | `tsc --noEmit` | Zero errors |
| Linting | ESLint (flat config, `@typescript-eslint`) | Zero errors, zero warnings |
| Code formatting | Prettier | 100% consistent |
| SCSS compilation | `sass` | Zero errors, zero deprecation warnings |
| Twig syntax | `twig.js` across all 51 `.twig` files | 51/51 parse cleanly |
| Settings schema | Custom script (Phase 10) | 41/41 settings schema-conformant, zero duplicate ids |
| JSON validity | Python `json.load` | `twilight.json`, `package.json`, `tsconfig.json`, both locale files |
| Production build | `vite build` | Succeeds end-to-end from a clean `npm install` |
| Color contrast | Computed WCAG relative-luminance ratios (Phase 14) | Every text/foreground token ≥ 4.5:1 (or ≥3:1 for large text/UI), measured not eyeballed |
| RTL logical-property audit | grep across all SCSS (Phase 11) | Zero raw `left`/`right` physical properties |
| Mobile-first audit | grep across all SCSS (Phase 11) | Zero `max-width` media queries |

Three real bugs were caught and fixed *by actually running these tools*
rather than assuming the config was correct, all this phase:
- ESLint caught an unsafe `any` assignment in `i18n.ts` (unvalidated
  `JSON.parse` result) and a missing return type in `main.ts`.
- Prettier found 3 inconsistently-formatted files.
- **`package.json`'s own `lint` script was broken since Phase 1** — it
  used the legacy `--ext` flag, incompatible with the flat
  `eslint.config.js` set up in that same phase. Never actually run
  until this phase. Fixed.

This is itself the most important finding of Phase 15: several tools
were *configured* early and assumed working, but not actually
*exercised* until now. Regression testing means running the thing, not
just having it installed.

## What requires a live Salla store or real browsers (not verifiable here)

This environment has no browser, no live Salla store, and no Partners
Portal access. The following are genuinely outside what can be tested
without one, and are flagged rather than claimed as done:

- **Cross-browser rendering** — Chrome/Safari/Firefox/Edge visual
  parity. The CSS uses modern, well-supported features throughout
  (`aspect-ratio`, flexbox/grid `gap`, CSS custom properties,
  `:focus-visible`, logical properties) — all have solid support in
  browsers from ~2021 onward, consistent with what a modern e-commerce
  storefront can reasonably target, but this hasn't been visually
  confirmed in an actual browser.
- **RTL visual QA with real Arabic content** — logical properties and
  the letter-spacing/typography rules are verified by code audit
  (Phase 11), but nobody has looked at a real rendered Arabic page.
  Arabic text length, line-wrapping, and number formatting can surface
  layout issues that don't show up in a property-level audit.
- **Theme Settings UI in the actual Partners Portal** — the 41 settings
  are schema-valid, but whether they *render correctly* as the intended
  input type (switch, list dropdown, etc.) in Salla's actual settings
  UI can only be confirmed by importing the theme there.
- **Every `VERIFICATION NEEDED` field flagged throughout this project**
  — 17 files, grep for the exact literal string to find them all
  (`grep -rl "VERIFICATION NEEDED" src/`). Variable names inferred from
  context or by analogy with confirmed fields, not confirmed against a
  live store's actual rendered data.
- **The Twilight Web Components** (`salla-add-product-button`,
  `salla-quantity-input`, `salla-cart-summary-card`, `salla-search`,
  etc.) — confirmed to exist and used with their documented attributes,
  but their actual runtime behavior can only be verified where the
  Twilight JS SDK actually runs, against a real cart/store.
- **Salla CLI theme preview** (`salla theme preview`) — the standard
  way to catch integration issues before publishing; wasn't available
  in this environment.

## Recommended next steps before a real launch

1. Run `salla theme preview` against a demo store and click through
   every page this project built.
2. Re-run the automated `npm run validate` suite after that pass, in
   case preview surfaces a template variable that needs a fallback.
3. Grep this codebase for `VERIFICATION NEEDED` and resolve each one
   against the live store's actual data before going to production.
4. A screen reader pass (VoiceOver/NVDA) on the Cart, Product, and
   Listing pages — the highest-interaction pages — since Phase 14's
   contrast/naming fixes were verified by computation and code review,
   not by an actual assistive-technology user.
