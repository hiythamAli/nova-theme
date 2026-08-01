import { useScroll } from '@hooks/useScroll';

/**
 * StickyBuyBar — shows the mobile sticky buy bar once the main product
 * form's add-to-cart button has scrolled out of the viewport, hides it
 * again if the user scrolls back up to it.
 */

export function initStickyBuyBar(): void {
  const stickyBuyBar = document.querySelector<HTMLElement>('[data-nova-sticky-buy]');
  const mainCta = document.querySelector<HTMLElement>('.nova-product-single__cta');

  if (!stickyBuyBar || !mainCta) {
    return;
  }

  useScroll(() => {
    const ctaRect = mainCta.getBoundingClientRect();
    const hasCtaScrolledPast = ctaRect.bottom < 0;
    stickyBuyBar.classList.toggle('is-visible', hasCtaScrolledPast);
  });
}
