/**
 * deferred — a barrel of every non-critical UI primitive's init function.
 * This file exists so main.ts can dynamically `import('./deferred')` as a
 * single statement, letting Rollup bundle everything below into one
 * separate, cacheable chunk rather than issuing seven small requests.
 */

export { initDropdowns } from '@components/Dropdown/Dropdown';
export { initAccordions } from '@components/Accordion/Accordion';
export { initTabs } from '@components/Tabs/Tabs';
export { initModals } from '@components/Modal/Modal';
export { initDrawers } from '@components/Drawer/Drawer';
export { initWishlistButtons } from '@components/Wishlist/Wishlist';
export { initCompareButtons } from '@components/Compare/Compare';
