/**
 * trapFocus — confines Tab/Shift+Tab cycling to the focusable elements
 * inside a container, and returns a cleanup function to release the trap.
 * Shared by Modal and Drawer rather than duplicated in each.
 */

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function trapFocus(container: HTMLElement): () => void {
  function handleKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') {
      return;
    }

    const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (!first || !last) {
      return;
    }

    const isShiftTab = event.shiftKey;

    if (isShiftTab && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!isShiftTab && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  container.addEventListener('keydown', handleKeydown);
  container.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus();

  return function releaseFocusTrap(): void {
    container.removeEventListener('keydown', handleKeydown);
  };
}
