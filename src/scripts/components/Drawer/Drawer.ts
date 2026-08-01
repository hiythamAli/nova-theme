import { trapFocus } from '@utils/trapFocus';

/**
 * Drawer — same open/close/focus-trap contract as Modal, kept as a
 * separate component (not a Modal variant) because its markup, animation
 * direction, and future usages (Cart Drawer, Wishlist, mobile nav in
 * Phase 5) are meaningfully different from a centered dialog.
 */

let releaseFocusTrap: (() => void) | null = null;
let lastFocusedElement: HTMLElement | null = null;

function getDrawer(drawerId: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[data-nova-drawer="${drawerId}"]`);
}

export function openDrawer(drawerId: string): void {
  const drawer = getDrawer(drawerId);

  if (!drawer) {
    return;
  }

  lastFocusedElement = document.activeElement as HTMLElement;
  drawer.setAttribute('data-open', 'true');
  document.body.style.overflow = 'hidden';
  releaseFocusTrap = trapFocus(drawer);
}

export function closeDrawer(drawerId: string): void {
  const drawer = getDrawer(drawerId);

  if (!drawer) {
    return;
  }

  drawer.setAttribute('data-open', 'false');
  document.body.style.overflow = '';
  releaseFocusTrap?.();
  lastFocusedElement?.focus();
}

export function initDrawers(): void {
  document.querySelectorAll<HTMLElement>('[data-nova-drawer-open]').forEach((trigger) => {
    const drawerId = trigger.getAttribute('data-nova-drawer-open');
    if (drawerId) {
      trigger.addEventListener('click', () => openDrawer(drawerId));
    }
  });

  document.querySelectorAll<HTMLElement>('[data-nova-drawer-close]').forEach((closeButton) => {
    const drawerId = closeButton.getAttribute('data-nova-drawer-close');
    if (drawerId) {
      closeButton.addEventListener('click', () => closeDrawer(drawerId));
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') {
      return;
    }
    document
      .querySelectorAll<HTMLElement>('[data-nova-drawer][data-open="true"]')
      .forEach((drawer) => {
        const drawerId = drawer.getAttribute('data-nova-drawer');
        if (drawerId) {
          closeDrawer(drawerId);
        }
      });
  });
}
