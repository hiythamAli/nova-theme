import { initGallery } from '@components/Gallery/Gallery';
import { initStickyBuyBar } from '@components/StickyBuyBar/StickyBuyBar';

/**
 * NOVA Theme — Single Product Page Script
 * Loaded only on src/views/pages/product/single.twig via {% block scripts %}.
 * Tabs, Accordion, Wishlist, Compare are already initialized globally in
 * main.ts and work here without any page-specific wiring.
 */

initGallery();
initStickyBuyBar();
