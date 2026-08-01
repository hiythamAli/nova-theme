# NOVA Theme — Installation Guide

## Requirements

- Node.js ≥ 18
- npm (ships with Node)
- [Salla CLI](https://docs.salla.dev) — required to preview the theme
  against a real store; install per Salla's own CLI docs
- A Salla Partners account with a demo/development store

## 1. Install dependencies

```bash
npm install
```

This installs Vite, TypeScript, Sass, ESLint, Prettier, and the `twig`
package used only for local template-syntax validation (not part of the
runtime theme).

## 2. Build the theme assets

```bash
npm run build
```

Compiles `src/scripts/main.ts` (+ the page-specific entries: `home.ts`,
`listing.ts`, `product.ts`) and `src/assets/styles/main.scss` into
`dist/`. `master.twig` and the page-specific `{% block scripts %}` tags
reference these compiled files by fixed name (`main.js`, `main.css`,
`home.js`, etc.) via Salla's `asset()` Twig filter — the build must run
before the theme is usable.

For active development with instant rebuilds:

```bash
npm run dev
```

## 3. Preview against a real store

This repository's root — the folder containing `twilight.json` — is the
theme root the Salla CLI expects. From that folder:

```bash
salla theme preview
```

Follow the CLI's prompts to link a development store. This is the only
way to see the theme rendering real store data (products, categories,
cart) rather than the static markup in `src/views/`.

## 4. Before publishing

Run the full validation suite:

```bash
npm run validate
```

This chains: TypeScript typecheck → ESLint → Prettier format check →
Twig syntax validation → production build. All must pass.

Then work through `docs/TESTING.md`'s "Recommended next steps" section —
in particular, grep the codebase for `VERIFICATION NEEDED` and confirm
each flagged field name against the real data your preview store
renders, since several variable names throughout this theme were
inferred from Salla's documentation rather than confirmed against a live
store (each one is commented inline with why).

## Common issues

**Styles not appearing in preview**: confirm `npm run build` has been
run and `dist/main.css` exists — the Salla CLI serves the built assets,
not the SCSS source directly.

**A component looks unstyled or a button does nothing**: check whether
it's one of the confirmed official Salla Web Components
(`salla-add-product-button`, `salla-quantity-input`, `salla-search`,
etc. — see `docs/architecture-mapping.md` for the full list). These
self-initialize via the Twilight JS SDK once `salla.init()` runs at
`{% hook 'body:end' %}` in `master.twig` — they won't function outside
a real Salla store context (i.e. not from opening the `.twig` files
directly).
