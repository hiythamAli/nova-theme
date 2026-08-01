# NOVA Theme — Developer Guide

## Architecture at a glance

NOVA is a Salla Twilight theme: server-rendered Twig templates plus a
TypeScript/SCSS asset pipeline built with Vite. See
`docs/architecture-mapping.md` for the full record of how this maps to
(and occasionally corrects) the original NOVA project docs in `/docs`
at the repo root — that file is the definitive source for *why* things
are structured the way they are, including every point where official
Salla documentation overrode an original assumption.

```
twilight.json          Theme manifest — settings, features, custom components
src/
  assets/
    styles/              SCSS, 7-1 architecture (see below)
    images/ fonts/ icons/
  scripts/                TypeScript
    main.ts                 Global entry — critical-path only (see Performance)
    deferred.ts              Dynamically-imported non-critical interactivity
    pages/                   Page-specific entries (home.ts, listing.ts, product.ts)
    components/              One folder per component, e.g. components/Modal/Modal.ts
    hooks/ services/ utils/ config/ types/
  locales/                ar.json (default), en.json
  views/
    layouts/master.twig      Shared layout, required Twilight hooks
    pages/                   Fixed Salla page paths — do not rename these files
    components/               Twig markup for header/footer/home sections
    partials/                 Reusable Twig includes (product cards, SEO, etc.)
```

## SCSS architecture (7-1 pattern)

```
abstracts/   Sass variables, functions, mixins — zero CSS output
base/        Resets, typography, CSS custom property emission
layout/      Grid, containers
components/  One file per UI component
pages/       Page-specific overrides (currently unused — components/ covers it)
themes/      Color custom properties (light theme; dark reserved for future)
animations/  Keyframes
```

**The Golden Rule, enforced mechanically**: every color, spacing value,
radius, shadow, font size, breakpoint, etc. must come from
`abstracts/_tokens.scss` via the accessor functions in
`abstracts/_functions.scss` (`f.color('primary')`, `f.spacing('16')`,
etc.) — never a raw literal. Each accessor `@error`s loudly on an
unknown key, so a typo is caught at build time.

### Adding a new design token

1. Add the value to the relevant map in `abstracts/_tokens.scss`.
2. If it's a static (non-theme-color) token, it's automatically emitted
   as a CSS custom property by the `@each` loop in `base/_root.scss` —
   no extra step needed. Colors are emitted separately in
   `themes/_light.scss`.
3. Use it via the matching function in `abstracts/_functions.scss`
   (add one if the map is new).

## Adding a new component

Follow the pattern used throughout: one SCSS file in
`components/_name.scss` (registered in `main.scss`), and if it needs
interactivity, a TypeScript file at `scripts/components/Name/Name.ts`
exporting a single `initName()` function.

- **CSS-first**: reach for CSS before JavaScript (see Button, Tooltip,
  Pagination for examples of zero-JS components).
- **State lives in the DOM, not just in JS**: interactive components
  toggle real attributes (`aria-expanded`, `data-open`, `hidden`) and
  CSS reacts to those attributes directly — see `_disclosure.scss` /
  `Dropdown.ts` for the pattern. This means the DOM is always the
  single source of truth for a component's visual state.
- **Register the init function**: add it to either the critical tier
  (`main.ts`, only if it affects first paint) or the deferred tier
  (`deferred.ts`, everything else) — see the comment block at the top
  of `main.ts` for the reasoning.

## Adding a new page

Salla's page paths are fixed — see the confirmed list in
`docs/architecture-mapping.md`'s Phase 9 section. Don't invent new page
files; if you need a new generic content page, that's what
`page-single.twig` (merchant-authored via Salla's dashboard) is for.

## Coding standards summary

Full standards are in the project's `/docs/08-Coding-Standards.md`.
Highlights actually enforced by tooling in this repo:

- Strict TypeScript (`tsconfig.json`) — `noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`, no implicit `any`, etc.
- ESLint flat config (`eslint.config.js`) — no unused vars, explicit
  return types, max 250 lines/file, max 40 lines/function (soft limits,
  several components intentionally split to respect these).
- Prettier — 100-char line width, single quotes, 2-space indent.
- Verb-first function names, `is`/`has`/`should` boolean names — see
  any file in `scripts/components/` for examples.

Run `npm run validate` before committing — see `docs/TESTING.md`.

## Verification status

Not every Twig variable in this theme is confirmed against live Salla
data — where a field name was inferred rather than confirmed, it's
flagged inline with a `VERIFICATION NEEDED` comment explaining the
reasoning and what to check. `grep -rl "VERIFICATION NEEDED" src/` finds
all of them. This is deliberate: an inferred-but-flagged field is far
safer than a silent guess, but it does mean these need confirming
against your actual store's rendered data before you rely on them.
