/**
 * i18n — a small bridge for the handful of strings client-generated markup
 * needs (Toast, dynamically-inserted ARIA labels, etc). Twig owns all
 * translation via `trans()`; this only reads what master.twig already
 * rendered into a JSON script tag, so no string is ever duplicated in TS.
 */

const SCRIPT_TAG_ID = 'nova-i18n';

let cache: Record<string, string> | null = null;

function isStringRecord(value: unknown): value is Record<string, string> {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.values(value).every((entry) => typeof entry === 'string')
  );
}

function readTranslations(): Record<string, string> {
  if (cache) {
    return cache;
  }

  const scriptTag = document.getElementById(SCRIPT_TAG_ID);

  try {
    const parsed: unknown = scriptTag?.textContent ? JSON.parse(scriptTag.textContent) : {};
    cache = isStringRecord(parsed) ? parsed : {};
  } catch {
    cache = {};
  }

  return cache ?? {};
}

export function t(key: string, fallback: string = key): string {
  return readTranslations()[key] ?? fallback;
}
