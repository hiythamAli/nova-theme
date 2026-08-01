# NOVA Theme — Release Notes

## v1.0.0

Initial release. Built phase-by-phase against `10-Development-Roadmap.md`,
with every phase validated (TypeScript, ESLint, Prettier, SCSS, Twig
syntax, JSON schema, and a real production build) before moving to the
next — see `docs/TESTING.md` for the full validation record, and
`docs/PRE-PUBLISH-CHECKLIST.md` before this goes to a real store.

### Highlights

- Full Salla Twilight architecture: correct `twilight.json` manifest,
  confirmed page paths, confirmed hooks, and the official Web Components
  (`salla-add-product-button`, `salla-quantity-input`, `salla-search`,
  `salla-cart-summary-card`, and others) used for all cart/stock/search
  logic rather than reimplemented.
- Complete design token system — colors, typography, spacing, radius,
  shadows, motion, breakpoints — with zero hardcoded design values
  anywhere in the codebase, enforced by accessor functions that error on
  an unknown token.
- Native RTL (Arabic default) and LTR (English) support via CSS logical
  properties throughout — audited with zero violations found (Phase 11).
- WCAG AA color contrast, computed and verified, not assumed — two real
  contrast failures in the original token values were found and fixed
  (Phase 14).
- 41 Theme Settings, schema-validated against Salla's confirmed
  `twilight.json` format, the majority wired to real, auditable behavior
  (see `docs/SETTINGS.md`).
- Performance: code-split, dynamically-imported non-critical
  interactivity; an unused ~40KB dependency (Alpine.js) found and
  removed, cutting the critical-path JS bundle by 95%.
- Full page set: Home, Products Listing (serving Category/Offers/Tags/
  Search contexts, per Salla's actual unified architecture), Single
  Product, Cart, Wishlist, Brands (listing + single), Blog (listing +
  single), Loyalty, Thank You, Customer Profile/Notifications/Orders,
  and the generic Single Page template for merchant content.

### Known limitations

- 17 files carry inline `VERIFICATION NEEDED` flags for field names
  inferred from Salla's documentation rather than confirmed against a
  live store — see `docs/TESTING.md`.
- No `sitemap.xml`/`robots.txt` — neither exists as a theme-level
  concept in Salla's confirmed architecture; almost certainly
  platform-generated.
- Popup System and Blog sidebar/related-posts have Theme Settings
  declared but no corresponding UI built yet — see `docs/SETTINGS.md`'s
  wired/unwired accounting.
- Dark mode is reserved (a Theme Setting exists, explicitly labeled
  "Future" in the original project docs) but not implemented.
- Not yet tested in a real browser or against a live Salla store — see
  `docs/TESTING.md`'s "What requires a live Salla store" section before
  launch.

### Corrections made from the original project documentation

Several points where NOVA's original `/docs` assumptions didn't match
Salla's actual platform were found and corrected during development
rather than shipped as-documented — full details with sources in
`docs/architecture-mapping.md`. Briefest summary:

- The whole architecture is Twig/Twilight-based, not a generic
  TypeScript SPA as the original docs described.
- `twilight.json`'s settings schema is a flat field array, not the
  nested groups first assumed.
- No separate Category, About, Contact, Policies, 404, or Maintenance
  page templates exist — Salla unifies these into fewer, different
  templates than the original docs assumed.
- Several component interactions (cart, wishlist, search) delegate to
  official Salla Web Components rather than custom-built equivalents.

### Phase 17 (Release) findings

- `twilight.json` carried two non-standard top-level keys
  (`_settings_note`, `_features_note`) added during development purely
  for in-file documentation. Removed before release — Salla's manifest
  schema tolerance for unrecognized top-level properties wasn't
  confirmed, and shipping unconfirmed keys in the actual theme manifest
  was an unnecessary risk to theme import. Their content is fully
  preserved in `docs/architecture-mapping.md`'s Phase 6 and Phase 10
  sections, so nothing was lost.
- `repo_url`/`support_url` in `twilight.json` are still placeholder
  values — see `docs/PRE-PUBLISH-CHECKLIST.md`, the first item.
