import { showToast } from '@components/Toast/Toast';
import { t } from '@config/i18n';

/**
 * Newsletter — handles the subscribe form submit.
 *
 * VERIFICATION NEEDED: no confirmed Salla newsletter-subscribe endpoint was
 * found in the docs consulted so far (Cart, Wishlist, and general SDK
 * modules were researched; a dedicated Marketing/Newsletter API was not).
 * This currently only prevents a full page reload and shows a success
 * toast optimistically — replace the body of handleSubmit with a real
 * `fetch()` call to the confirmed endpoint before shipping.
 */

function handleSubmit(event: SubmitEvent): void {
  event.preventDefault();

  const form = event.currentTarget as HTMLFormElement;
  const emailInput = form.querySelector<HTMLInputElement>('input[type="email"]');

  if (!emailInput?.checkValidity()) {
    emailInput?.reportValidity();
    return;
  }

  // TODO: replace with the real Salla newsletter-subscribe endpoint once confirmed.
  showToast(t('newsletter_subscribed', 'Thanks for subscribing!'), 'success');
  form.reset();
}

export function initNewsletterForms(): void {
  document.querySelectorAll<HTMLFormElement>('[data-nova-newsletter-form]').forEach((form) => {
    form.addEventListener('submit', handleSubmit);
  });
}
