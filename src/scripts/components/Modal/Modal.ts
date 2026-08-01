import { trapFocus } from '@utils/trapFocus';

/**
 * Modal — a single reusable open/close controller keyed by data-modal-id,
 * used for Quick View, Size Guide, and any future dialog. Markup is plain
 * HTML with [data-open] toggled for styling (see components/_overlay.scss).
 */

let releaseFocusTrap: (() => void) | null = null;
let lastFocusedElement: HTMLElement | null = null;

function getModal(modalId: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[data-nova-modal="${modalId}"]`);
}

export function openModal(modalId: string): void {
  const modal = getModal(modalId);

  if (!modal) {
    return;
  }

  lastFocusedElement = document.activeElement as HTMLElement;
  modal.setAttribute('data-open', 'true');
  document.body.style.overflow = 'hidden';
  releaseFocusTrap = trapFocus(modal);
}

export function closeModal(modalId: string): void {
  const modal = getModal(modalId);

  if (!modal) {
    return;
  }

  modal.setAttribute('data-open', 'false');
  document.body.style.overflow = '';
  releaseFocusTrap?.();
  lastFocusedElement?.focus();
}

export function initModals(): void {
  document.querySelectorAll<HTMLElement>('[data-nova-modal-open]').forEach((trigger) => {
    const modalId = trigger.getAttribute('data-nova-modal-open');
    if (modalId) {
      trigger.addEventListener('click', () => openModal(modalId));
    }
  });

  document.querySelectorAll<HTMLElement>('[data-nova-modal-close]').forEach((closeButton) => {
    const modalId = closeButton.getAttribute('data-nova-modal-close');
    if (modalId) {
      closeButton.addEventListener('click', () => closeModal(modalId));
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') {
      return;
    }
    document
      .querySelectorAll<HTMLElement>('[data-nova-modal][data-open="true"]')
      .forEach((modal) => {
        const modalId = modal.getAttribute('data-nova-modal');
        if (modalId) {
          closeModal(modalId);
        }
      });
  });
}
