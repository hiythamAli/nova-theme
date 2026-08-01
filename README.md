# NOVA — Premium Salla Theme

Minimal-luxury Salla (Twilight) theme built with TypeScript, SCSS, and
Vite (plain, dependency-free interactivity — see
`docs/architecture-mapping.md` Phase 12 for why Alpine.js was removed).

## Documentation

| Guide | For |
|---|---|
| [`docs/INSTALLATION.md`](docs/INSTALLATION.md) | Getting the theme running and previewing it against a real store |
| [`docs/DEVELOPER-GUIDE.md`](docs/DEVELOPER-GUIDE.md) | Architecture, folder structure, how to extend the theme |
| [`docs/THEME-GUIDE.md`](docs/THEME-GUIDE.md) | Merchant-facing feature overview |
| [`docs/SETTINGS.md`](docs/SETTINGS.md) | Every Theme Setting, generated directly from `twilight.json` |
| [`docs/CUSTOMIZATION.md`](docs/CUSTOMIZATION.md) | Changing colors/fonts/tokens safely |
| [`docs/TESTING.md`](docs/TESTING.md) | What's verified, what still needs a live store, how to run the checks |
| [`docs/PRE-PUBLISH-CHECKLIST.md`](docs/PRE-PUBLISH-CHECKLIST.md) | The concrete action list before this goes to a real store or GitHub |
| [`docs/RELEASE-NOTES.md`](docs/RELEASE-NOTES.md) | Version history and known limitations |
| [`docs/architecture-mapping.md`](docs/architecture-mapping.md) | The definitive record of every decision, correction, and confirmed-vs-inferred Salla API detail across all 16 build phases |

The original project specification docs (design system, brand system,
coding standards, etc.) live in this repo's parent `/docs` folder as
provided; `architecture-mapping.md` above is the record of where Salla's
actual platform required deviating from them, and why.

## Requirements

- Node.js ≥ 18
- Salla CLI (for local theme preview against a demo store)

## Getting started

```bash
npm install
npm run dev        # Vite dev server for local asset development
npm run build      # Production build → dist/
npm run validate   # Full check: typecheck + lint + format + Twig syntax + build
```

See `docs/INSTALLATION.md` for the complete setup and preview workflow.

## Structure

```
twilight.json          # Salla theme manifest (settings, features, components)
src/
  assets/
    styles/             # SCSS (7-1 architecture, all values from Design Tokens)
    images/ fonts/ icons/
  scripts/               # TypeScript — components, hooks, services, utils
    main.ts               # critical-path global entry (loaded on every page)
    deferred.ts            # non-critical interactivity, dynamically imported
    pages/                 # page-specific entries (home.ts, listing.ts, product.ts)
  locales/                # ar.json (default), en.json
  views/
    layouts/master.twig    # shared layout, required Twilight hooks
    pages/                 # fixed Salla page paths (index.twig, product/, etc.)
    components/             # Twig markup for Theme Features / custom components
    partials/                # reusable Twig includes (product cards, SEO, etc.)
scripts/                # Node scripts: Twig syntax validation, settings-guide generator
docs/                   # See the documentation table above
```

## Status

**v1.0.0 — all 17 development phases complete** (Foundation through
Release). See `docs/RELEASE-NOTES.md` for the full summary and known
limitations. Before deploying to a live store, work through
`docs/PRE-PUBLISH-CHECKLIST.md` — in particular, the placeholder
`repo_url`/`support_url` in `twilight.json` and the 17 files still
carrying `VERIFICATION NEEDED` flags need resolving against your actual
store first.
