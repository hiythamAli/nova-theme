/**
 * Accordion — toggles aria-expanded on its trigger. When the parent group
 * carries [data-nova-accordion-single], opening one item closes its
 * siblings (FAQ pattern); otherwise items are independent.
 */

const GROUP_SELECTOR = '[data-nova-accordion]';
const TRIGGER_SELECTOR = '.nova-accordion__trigger';

function closeSiblings(group: HTMLElement, exceptTrigger: HTMLElement): void {
  group.querySelectorAll<HTMLElement>(TRIGGER_SELECTOR).forEach((trigger) => {
    if (trigger !== exceptTrigger) {
      trigger.setAttribute('aria-expanded', 'false');
    }
  });
}

export function initAccordions(): void {
  document.querySelectorAll<HTMLElement>(GROUP_SELECTOR).forEach((group) => {
    const isSingleOpen = group.hasAttribute('data-nova-accordion-single');

    group.querySelectorAll<HTMLElement>(TRIGGER_SELECTOR).forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';

        if (isSingleOpen && !isOpen) {
          closeSiblings(group, trigger);
        }

        trigger.setAttribute('aria-expanded', String(!isOpen));
      });
    });
  });
}
