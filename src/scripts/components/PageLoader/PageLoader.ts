/**
 * PageLoader — hides the full-page loading overlay once the window's
 * `load` event fires. Conditional on theme.settings 'general_page_loader'
 * — the element simply won't exist in the DOM when disabled, so this
 * safely no-ops via the null check.
 */

export function initPageLoader(): void {
  const loader = document.querySelector<HTMLElement>('[data-nova-page-loader]');

  if (!loader) {
    return;
  }

  function hideLoader(): void {
    loader?.classList.add('is-hidden');
  }

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
  }
}
