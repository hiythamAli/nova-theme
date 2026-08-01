import { showToast } from '@components/Toast/Toast';
import { t } from '@config/i18n';

/**
 * Compare — client-side only. No official Salla "compare" API or web
 * component appears in the confirmed Web Components reference (only
 * cart/wishlist have documented SDK modules), so rather than invent one,
 * this is implemented as a genuinely NOVA-side feature: selected product
 * IDs live in localStorage and the Compare page (Phase 9) reads them back
 * to fetch each product's data via whatever product-lookup mechanism that
 * page ends up using.
 */

const STORAGE_KEY = 'nova_compare_ids';
const MAX_COMPARE_ITEMS = 4;

function readCompareIds(): number[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

function writeCompareIds(ids: number[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  updateCompareCount();
}

function updateCompareCount(): void {
  const count = readCompareIds().length;
  document.querySelectorAll<HTMLElement>('[data-compare-count]').forEach((element) => {
    element.textContent = String(count);
  });
}

function toggleCompareId(productId: number): boolean {
  const ids = readCompareIds();
  const index = ids.indexOf(productId);
  const isAdding = index === -1;

  if (isAdding && ids.length >= MAX_COMPARE_ITEMS) {
    showToast(
      t('compare_limit_reached', `You can compare up to ${MAX_COMPARE_ITEMS} products`),
      'info',
    );
    return false;
  }

  if (isAdding) {
    ids.push(productId);
  } else {
    ids.splice(index, 1);
  }

  writeCompareIds(ids);
  return isAdding;
}

export function initCompareButtons(): void {
  updateCompareCount();

  document.querySelectorAll<HTMLButtonElement>('[data-nova-compare-toggle]').forEach((button) => {
    const productId = Number(button.dataset['productId']);
    button.setAttribute('aria-pressed', String(readCompareIds().includes(productId)));

    button.addEventListener('click', () => {
      const isNowComparing = toggleCompareId(productId);
      button.setAttribute('aria-pressed', String(isNowComparing));
    });
  });
}
