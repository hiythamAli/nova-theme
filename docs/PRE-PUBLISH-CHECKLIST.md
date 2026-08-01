# NOVA Theme — Pre-Publish Checklist

Run through this before publishing to GitHub or importing into a real
Salla store. Distinct from `docs/TESTING.md` (which records what's been
verified) — this is the action list.

## Must fix before publishing

- [ ] **`twilight.json`'s `repo_url` and `support_url` are still
      placeholders** (`https://github.com/your-org/nova-theme`,
      `https://your-support-url.example.com`). Replace both with real
      URLs before publishing — Salla's Partners Portal likely surfaces
      these to merchants.
- [ ] `package.json`'s `author` field is a name, not an org/contact —
      confirm this is intentional.
- [ ] Confirm `store.whatsapp` and any other store-specific values used
      as fallbacks throughout the theme are appropriate for the target
      store, not placeholder content.

## Must verify against a real store (see docs/TESTING.md for why these can't be checked here)

- [ ] Run `salla theme preview` and click through every page.
- [ ] Grep `VERIFICATION NEEDED` (17 files as of Phase 16) and confirm
      each flagged field name against real rendered data.
- [ ] Screen reader pass (VoiceOver/NVDA) on Cart, Product, and Listing
      pages.
- [ ] Visual RTL check with real Arabic product/category names —
      confirm no unexpected line-wrapping or overflow.

## Automated — should already be passing, confirm with one command

```bash
npm run validate
```

If this fails, stop — do not publish until it passes.

## Packaging for GitHub

- [ ] `node_modules/` and `dist/` are gitignored (confirmed in
      `.gitignore`) — never commit build output or dependencies.
- [ ] `README.md` is current (it links to every doc in `/docs`).
- [ ] Tag the release matching `twilight.json`'s `version` field
      (currently `1.0.0`) and `package.json`'s `version` field — keep
      these two in sync on every release.

## Packaging for Salla Partners Portal

- [ ] Confirm the built theme validates against Salla's own theme
      review requirements (Partners Portal will run its own checks on
      upload — this repo's own validation doesn't replace that).
- [ ] Confirm whether the Salla CLI/Partners Portal upload flow builds
      the theme itself (most likely, given the CLI handles the
      `salla theme preview`/publish workflow) or expects a pre-built
      `dist/` folder included in the upload — not confirmed by any doc
      consulted during this build. If in doubt, run `npm run build`
      immediately before publishing so `dist/` is current either way.
