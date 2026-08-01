/**
 * Dropdown — toggles a trigger's aria-expanded attribute; CSS reacts to
 * that attribute directly (see components/_disclosure.scss), so this file
 * owns only the interaction, never the visual state.
 */

const TRIGGER_SELECTOR = '[data-nova-dropdown-trigger]';

function closeDropdown(trigger: HTMLElement): void {
  trigger.setAttribute('aria-expanded', 'false');
}

function toggleDropdown(trigger: HTMLElement): void {
  const isOpen = trigger.getAttribute('aria-expanded') === 'true';
  document
    .querySelectorAll<HTMLElement>(TRIGGER_SELECTOR)
    .forEach((otherTrigger) => closeDropdown(otherTrigger));
  trigger.setAttribute('aria-expanded', String(!isOpen));
}

export function initDropdowns(): void {
  const triggers = document.querySelectorAll<HTMLElement>(TRIGGER_SELECTOR);

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleDropdown(trigger);
    });
  });

  document.addEventListener('click', () => {
    triggers.forEach((trigger) => closeDropdown(trigger));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      triggers.forEach((trigger) => closeDropdown(trigger));
    }
  });
}
