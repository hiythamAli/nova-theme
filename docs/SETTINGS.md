# NOVA Theme — Settings Guide

Generated directly from `twilight.json`, cross-referenced against actual
usage in `src/views/` and `src/scripts/` — the Wired column is computed,
not claimed, so this file can't drift from reality. Regenerate after any
settings change: `python3 scripts/generate-settings-guide.py`.

## General

| Setting | Type | Default | Wired | id |
|---|---|---|---|---|
| Primary Color | string | #111111 | ✅ | `general_primary_color` |
| Secondary Color | string | #F8F8F8 | ✅ | `general_secondary_color` |
| Accent Color | string | #C7A76C | ✅ | `general_accent_color` |
| Enable Dark Mode (Future) | boolean | Off | — | `general_enable_dark_mode` |
| Page Loader | boolean | On | ✅ | `general_page_loader` |
| Smooth Scroll | boolean | On | ✅ | `general_smooth_scroll` |

## Header

| Setting | Type | Default | Wired | id |
|---|---|---|---|---|
| Sticky Header | boolean | On | ✅ | `header_sticky_header` |
| Transparent Header | boolean | Off | ✅ | `header_transparent_header` |
| Announcement Bar | boolean | On | ✅ | `header_announcement_bar` |

## Footer

| Setting | Type | Default | Wired | id |
|---|---|---|---|---|
| Show Payment Icons | boolean | On | ✅ | `footer_show_payment_icons` |
| Show Social Links | boolean | On | ✅ | `footer_show_social_links` |

## Hero Banner

| Setting | Type | Default | Wired | id |
|---|---|---|---|---|
| Hero Autoplay | boolean | On | ✅ | `hero_autoplay` |
| Hero Autoplay Speed (ms) | numeric | 6000 | ✅ | `hero_autoplay_speed_ms` |

## Product Cards

| Setting | Type | Default | Wired | id |
|---|---|---|---|---|
| Product Card Style | list | minimal (options: Minimal, Bordered, Elevated) | ✅ | `card_style` |
| Product Card Image Ratio | list | 3-4 (options: 3:4, 4:5, 1:1) | ✅ | `card_image_ratio` |
| Quick View | boolean | On | ✅ | `card_quick_view` |
| Quick Add | boolean | On | ✅ | `card_quick_add` |

## Animations

| Setting | Type | Default | Wired | id |
|---|---|---|---|---|
| Enable Animations | boolean | On | ✅ | `animation_enable` |

## Performance

| Setting | Type | Default | Wired | id |
|---|---|---|---|---|
| Lazy Load Images | boolean | On | — | `performance_lazy_loading` |

## Typography

| Setting | Type | Default | Wired | id |
|---|---|---|---|---|
| Headings Font | list | primary (options: IBM Plex Sans Arabic, Inter) | ✅ | `typography_heading_font` |
| Uppercase Navigation | boolean | Off | ✅ | `typography_uppercase_nav` |

## Product Page

| Setting | Type | Default | Wired | id |
|---|---|---|---|---|
| Sticky Gallery on Product Page | boolean | On | ✅ | `product_sticky_gallery` |
| Sticky Buy Bar (Mobile) | boolean | On | ✅ | `product_sticky_buy_bar` |
| Show Trust Badges | boolean | On | ✅ | `product_show_trust_badges` |

## Category Page

| Setting | Type | Default | Wired | id |
|---|---|---|---|---|
| Sidebar Filters | boolean | On | ✅ | `category_sidebar_filters` |
| Products Per Row (Desktop) | numeric | 4 | ✅ | `category_products_per_row` |
| Infinite Scroll | boolean | Off | — | `category_infinite_scroll` |

## Cart

| Setting | Type | Default | Wired | id |
|---|---|---|---|---|
| Free Shipping Progress Bar | boolean | On | ✅ | `cart_show_free_shipping_bar` |
| Show Coupon Field | boolean | On | ✅ | `cart_show_coupon_field` |

## Popup System

| Setting | Type | Default | Wired | id |
|---|---|---|---|---|
| Enable Popup System | boolean | Off | — | `popup_enable` |
| Popup Delay (seconds) | numeric | 5 | — | `popup_delay_seconds` |
| Trigger on Exit Intent | boolean | On | — | `popup_exit_intent` |

## Floating Elements

| Setting | Type | Default | Wired | id |
|---|---|---|---|---|
| Floating WhatsApp Button | boolean | On | ✅ | `floating_whatsapp` |
| Scroll To Top Button | boolean | On | ✅ | `floating_scroll_top` |

## Accessibility

| Setting | Type | Default | Wired | id |
|---|---|---|---|---|
| Respect Reduced Motion Preference | boolean | On | — | `a11y_reduced_motion_respect` |

## SEO

| Setting | Type | Default | Wired | id |
|---|---|---|---|---|
| Enable Structured Data (Schema.org) | boolean | On | ✅ | `seo_enable_structured_data` |
| Meta Title Suffix | string | *(empty)* | ✅ | `seo_meta_title_suffix` |

## Blog

| Setting | Type | Default | Wired | id |
|---|---|---|---|---|
| Show Blog Sidebar | boolean | On | — | `blog_show_sidebar` |
| Show Related Posts | boolean | On | — | `blog_show_related_posts` |

## Advanced

| Setting | Type | Default | Wired | id |
|---|---|---|---|---|
| Custom CSS | string | *(empty)* | ✅ | `advanced_custom_css` |
| Custom JavaScript | string | *(empty)* | ✅ | `advanced_custom_js` |

**32 of 41 settings are wired to real behavior** (the setting's id is referenced by a template or script, not just declared). The rest are documented as intentionally declared-only, each with its own reasoning, in `docs/architecture-mapping.md`'s Phase 10 section — mainly the Popup System (no Popup UI component was ever built to wire it to) and Blog sidebar/related-posts (same reason — declared ahead of a UI pass that hasn't happened yet).
