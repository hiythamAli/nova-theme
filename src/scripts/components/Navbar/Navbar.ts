import { useScroll } from '@hooks/useScroll';

/**
 * Navbar — adds a shadow to the sticky header once the page has scrolled
 * past the header's own height, and wires up the mobile menu toggle button.
 * Mounted once from main.ts since the header appears on every page.
 */

const STICKY_SHADOW_CLASS = 'nova-header--scrolled';
const MENU_OPEN_CLASS = 'nova-menu-open';

export function initNavbar(): void {
  const header = document.querySelector<HTMLElement>('.nova-header[data-sticky="true"]');

  if (header) {
    useScroll((scrollY) => {
      const hasScrolled = scrollY > header.offsetHeight;
      header.classList.toggle(STICKY_SHADOW_CLASS, hasScrolled);
    });
  }

  const menuToggle = document.querySelector<HTMLButtonElement>('.nova-header__menu-toggle');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const isOpen = document.body.classList.toggle(MENU_OPEN_CLASS);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }
}
