/**
 * useScroll — tracks the window's scroll position and exposes it through a
 * subscription callback. Kept dependency-free (no rAF library) since this
 * is the only scroll listener the whole theme needs; components subscribe
 * rather than each attaching their own listener.
 */

type ScrollListener = (scrollY: number, isScrollingDown: boolean) => void;

const listeners = new Set<ScrollListener>();
let lastScrollY = 0;
let isBound = false;

function handleScroll(): void {
  const currentScrollY = window.scrollY;
  const isScrollingDown = currentScrollY > lastScrollY;

  listeners.forEach((listener) => listener(currentScrollY, isScrollingDown));
  lastScrollY = currentScrollY;
}

export function useScroll(listener: ScrollListener): () => void {
  if (!isBound) {
    window.addEventListener('scroll', handleScroll, { passive: true });
    isBound = true;
  }

  listeners.add(listener);

  return function unsubscribe(): void {
    listeners.delete(listener);
  };
}
