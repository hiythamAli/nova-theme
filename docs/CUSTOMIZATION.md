# NOVA Theme — Customization Guide

## The easy way: Theme Settings

Most day-to-day customization doesn't need code changes at all — see
`docs/SETTINGS.md` for the full list of 41 settings available in the
Salla Partners Portal (colors, header/footer behavior, product card
style, animations, and more).

## Changing colors, spacing, typography, or other design values

**Never edit a hex code, px value, or font name directly in a component
file.** Every design value in this theme is a token — see
`src/assets/styles/abstracts/_tokens.scss`. To change the brand's accent
color sitewide, for example, edit `$nova-colors` there, not any
individual `.scss` file. This is enforced structurally: the accessor
functions in `abstracts/_functions.scss` `@error` on any key that isn't
in the token maps, so a stray hardcoded value would need to bypass the
whole system deliberately, not slip in by accident.

One nuance worth knowing: `accent` and `accent-text` are two different
tokens on purpose (see `docs/architecture-mapping.md` Phase 14) —
`accent` is for backgrounds/decorative fills, `accent-text` is a darker
variant used anywhere the color needs to work as legible foreground
text or a focus ring, for WCAG AA contrast reasons. If you're adding a
new component that uses the accent color as text, use `accent-text`,
not `accent`.

## Adding a new color, spacing value, or other token

See `docs/DEVELOPER-GUIDE.md`'s "Adding a new design token" section.

## Changing fonts

Update `$nova-font-primary`/`$nova-font-secondary` in
`abstracts/_tokens.scss`, and the corresponding `@font-face`/preload
setup wherever the current fonts are loaded (`master.twig`'s `<link
rel="preload">` and wherever the font files themselves live under
`src/assets/fonts/`).

## Custom CSS/JS without touching the codebase

The **Advanced** section of Theme Settings (`advanced_custom_css`,
`advanced_custom_js`) injects merchant-provided CSS/JS directly into
`master.twig`'s `<head>`/before `body:end` — no build step required, and
available to non-developer merchants directly from the Partners Portal.

## Adding a new homepage section

Homepage sections are either an official Salla Theme Feature (see the
confirmed slugs in `twilight.json`'s `features` array) or a custom Theme
Component registered in `twilight.json`'s `components` array — see the
existing `nova-hero-banner`/`nova-categories-grid`/etc. entries there for
the pattern, and their corresponding files in
`src/views/components/home/`. Both render automatically via `{%
component home %}` in `index.twig` in whatever order the merchant
arranges them in the Salla admin — no template changes needed to add a
new one to the page.

## Dark mode

Reserved but not implemented — `general_enable_dark_mode` exists as a
Theme Setting (explicitly labeled "(Future)" in the original project
docs), and `themes/_light.scss` has a commented, ready-to-use scope for
a future `.nova-theme--dark` class that would redefine the same
`--nova-color-*` custom property names. See that file directly.
