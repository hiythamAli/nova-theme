/**
 * Tabs — implements the WAI-ARIA Tabs pattern: one tab is selected and
 * focusable at a time (roving tabindex), Left/Right (or Up/Down) arrow
 * keys move selection, and each trigger's aria-controls points at its panel.
 */

const GROUP_SELECTOR = '[data-nova-tabs]';
const TRIGGER_SELECTOR = '.nova-tabs__trigger';

function selectTab(triggers: HTMLElement[], panels: HTMLElement[], index: number): void {
  triggers.forEach((trigger, triggerIndex) => {
    const isSelected = triggerIndex === index;
    trigger.setAttribute('aria-selected', String(isSelected));
    trigger.tabIndex = isSelected ? 0 : -1;
  });

  panels.forEach((panel, panelIndex) => {
    panel.hidden = panelIndex !== index;
  });

  triggers[index]?.focus();
}

function initTabGroup(group: HTMLElement): void {
  const triggers = Array.from(group.querySelectorAll<HTMLElement>(TRIGGER_SELECTOR));
  const panels = triggers
    .map((trigger) => {
      const panelId = trigger.getAttribute('aria-controls');
      return panelId ? document.getElementById(panelId) : null;
    })
    .filter((panel): panel is HTMLElement => panel !== null);

  triggers.forEach((trigger, index) => {
    trigger.addEventListener('click', () => selectTab(triggers, panels, index));

    trigger.addEventListener('keydown', (event) => {
      const isRtl = document.documentElement.dir === 'rtl';
      const isForward =
        event.key === 'ArrowDown' || event.key === (isRtl ? 'ArrowLeft' : 'ArrowRight');
      const isBackward =
        event.key === 'ArrowUp' || event.key === (isRtl ? 'ArrowRight' : 'ArrowLeft');

      if (!isForward && !isBackward) {
        return;
      }

      event.preventDefault();
      const direction = isForward ? 1 : -1;
      const nextIndex = (index + direction + triggers.length) % triggers.length;
      selectTab(triggers, panels, nextIndex);
    });
  });
}

export function initTabs(): void {
  document.querySelectorAll<HTMLElement>(GROUP_SELECTOR).forEach(initTabGroup);
}
