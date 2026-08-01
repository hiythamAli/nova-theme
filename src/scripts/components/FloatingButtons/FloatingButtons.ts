import { useScroll } from '@hooks/useScroll';

/**
 * FloatingButtons — reveals the scroll-to-top button once the page has
 * scrolled a meaningful distance, and handles the scroll-to-top click.
 */

const REVEAL_THRESHOLD_PX = 400;

export function initFloatingButtons(): void {
  const scrollTopButton = document.querySelector<HTMLButtonElement>('[data-nova-scroll-top]');

  if (!scrollTopButton) {
    return;
  }

  useScroll((scrollY) => {
    const shouldReveal = scrollY > REVEAL_THRESHOLD_PX;
    scrollTopButton.hidden = !shouldReveal;
  });

  scrollTopButton.addEventListener('click', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}
