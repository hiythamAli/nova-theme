/**
 * ListingView — toggles the products grid between grid and list layout by
 * setting a data-view attribute; all visual work happens in CSS
 * (components/_listing.scss).
 */

export function initListingView(): void {
  const grid = document.querySelector<HTMLElement>('[data-nova-listing-grid]');
  const viewButtons = document.querySelectorAll<HTMLButtonElement>('[data-nova-view]');

  if (!grid || viewButtons.length === 0) {
    return;
  }

  viewButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const view = button.dataset['novaView'];
      if (!view) {
        return;
      }

      grid.setAttribute('data-view', view);
      viewButtons.forEach((otherButton) => otherButton.classList.remove('is-active'));
      button.classList.add('is-active');
    });
  });
}
