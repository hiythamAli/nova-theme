import '@styles/main.scss';
import { initPageLoader } from '@components/PageLoader/PageLoader';
import { initNavbar } from '@components/Navbar/Navbar';
import { initFloatingButtons } from '@components/FloatingButtons/FloatingButtons';

/**
 * NOVA Theme — Global Entry Point
 * Loaded on every page via src/views/layouts/master.twig ({{ 'main.js' | asset('dist') }}).
 *
 * Split into two tiers for real code-splitting (Development Roadmap
 * Phase 12: Dynamic Imports, Code Splitting):
 *  - CRITICAL (imported statically, in this file's initial bundle):
 *    PageLoader and Navbar affect the very first paint/interaction
 *    (sticky header, mobile menu button) and must be ready immediately.
 *  - DEFERRED (dynamically imported after first paint): Dropdown,
 *    Accordion, Tabs, Modal, Drawer, Wishlist, Compare — all only matter
 *    once the visitor scrolls or interacts, so they're split into their
 *    own chunk(s) and loaded via requestIdleCallback rather than blocking
 *    the main thread during initial page load.
 *
 * Toast is intentionally never eagerly initialized here at all — it's a
 * programmatic API (showToast()) that other lazily-loaded modules import
 * directly when they need it, so it rides along in whichever chunk calls it.
 *
 * Alpine.js was removed in Phase 12 (Performance): it was listed in the
 * original tech stack and imported/started on every page since Phase 1,
 * but an audit found zero Twig templates anywhere in the theme actually
 * use an Alpine directive (x-data, x-show, etc.) — every interactive
 * component was built with plain TypeScript + data attributes instead.
 * Alpine was the dominant share of main.js's size; shipping an unused
 * ~40KB dependency to every visitor contradicted both the "keep
 * dependencies to the absolute minimum" rule and the point of this
 * phase. Re-adding it is a one-line change if a future component
 * genuinely needs declarative reactivity Twig markup can drive directly.
 */

initPageLoader();
initNavbar();
initFloatingButtons();

/**
 * loadDeferredInteractivity — dynamically imports and initializes every
 * non-critical UI primitive. Runs on requestIdleCallback (falls back to
 * a short setTimeout in browsers without it, e.g. Safari) so it never
 * competes with the critical rendering path.
 */
function loadDeferredInteractivity(): void {
  void import('./deferred').then((deferred) => {
    deferred.initDropdowns();
    deferred.initAccordions();
    deferred.initTabs();
    deferred.initModals();
    deferred.initDrawers();
    deferred.initWishlistButtons();
    deferred.initCompareButtons();
  });
}

const requestIdle =
  window.requestIdleCallback ??
  ((callback: () => void): number => window.setTimeout(callback, 200));
requestIdle(loadDeferredInteractivity);
