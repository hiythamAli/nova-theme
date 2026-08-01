/**
 * Toast — a programmatic notification API, since toasts are triggered by
 * other code (cart Ajax responses, form validation) rather than a user
 * clicking a dedicated trigger element. One shared region is created
 * lazily on first use and reused for every subsequent toast.
 */

import { t } from '@config/i18n';

export type ToastVariant = 'default' | 'success' | 'danger' | 'info';

const AUTO_DISMISS_MS = 4000;
const REGION_ID = 'nova-toast-region';

function getOrCreateRegion(): HTMLElement {
  let region = document.getElementById(REGION_ID);

  if (!region) {
    region = document.createElement('div');
    region.id = REGION_ID;
    region.className = 'nova-toast-region';
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    document.body.appendChild(region);
  }

  return region;
}

function removeToast(toast: HTMLElement): void {
  toast.classList.remove('nova-animate-fade');
  toast.style.opacity = '0';
  window.setTimeout(() => toast.remove(), 200);
}

export function showToast(message: string, variant: ToastVariant = 'default'): void {
  const region = getOrCreateRegion();

  const toast = document.createElement('div');
  toast.className = `nova-toast nova-animate-fade${variant !== 'default' ? ` nova-toast--${variant}` : ''}`;
  toast.innerHTML = `
    <span class="nova-toast__message"></span>
    <button type="button" class="nova-toast__close" aria-label="${t('dismiss', 'Dismiss')}">
      <i class="sicon-close" aria-hidden="true"></i>
    </button>
  `;
  // Set via textContent, not innerHTML, so caller-supplied messages can
  // never inject markup.
  toast.querySelector('.nova-toast__message')!.textContent = message;

  toast.querySelector('.nova-toast__close')?.addEventListener('click', () => removeToast(toast));

  region.appendChild(toast);
  window.setTimeout(() => removeToast(toast), AUTO_DISMISS_MS);
}
