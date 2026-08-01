import { showToast } from '@components/Toast/Toast';
import { t } from '@config/i18n';

/**
 * Wishlist toggle — heart icon on product cards.
 *
 * VERIFICATION NEEDED: docs.salla.dev confirms a "Wishlist APIs" module
 * exists on the Twilight JS SDK and that `salla.event.wishlist.onAdded(
 * (response, product_id) => ...)` is the add-completed event, but the
 * exact method to CALL (addItem/add/toggle, and its remove counterpart)
 * was not confirmed in the fetched docs. `salla.wishlist.addItem` /
 * `removeItem` below follow the naming convention confirmed for
 * `salla.cart.addItem`, which is the closest verified precedent — but
 * treat this as unverified until checked against the live SDK reference
 * or a real store's compiled JS.
 */

declare global {
  interface Window {
    salla?: {
      wishlist: {
        addItem: (params: { id: number }) => Promise<unknown>;
        removeItem: (params: { id: number }) => Promise<unknown>;
      };
      event: {
        wishlist: {
          onAdded: (callback: (response: unknown, productId: number) => void) => void;
        };
      };
    };
  }
}

export function initWishlistButtons(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-nova-wishlist-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      void handleWishlistToggle(button);
    });
  });
}

async function handleWishlistToggle(button: HTMLButtonElement): Promise<void> {
  const productId = Number(button.dataset['productId']);
  const isSaved = button.getAttribute('aria-pressed') === 'true';

  if (!productId || !window.salla) {
    return;
  }

  // Optimistic UI update — reverted on failure below.
  button.setAttribute('aria-pressed', String(!isSaved));

  try {
    if (isSaved) {
      await window.salla.wishlist.removeItem({ id: productId });
    } else {
      await window.salla.wishlist.addItem({ id: productId });
      showToast(t('added_to_wishlist', 'Added to wishlist'), 'success');
    }
  } catch {
    button.setAttribute('aria-pressed', String(isSaved));
    showToast(t('wishlist_error', 'Could not update wishlist'), 'danger');
  }
}
