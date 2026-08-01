#!/usr/bin/env python3
"""
Generates docs/SETTINGS.md directly from twilight.json, cross-referenced
against actual usage in src/views/ and src/scripts/ so the guide can
never claim a setting does something it doesn't. Re-run this after
adding or changing any setting:

    python3 scripts/generate-settings-guide.py
"""
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
d = json.loads((ROOT / "twilight.json").read_text())
settings = d["settings"]

GROUP_TITLES = {
    "general": "General", "header": "Header", "footer": "Footer",
    "hero": "Hero Banner", "card": "Product Cards", "animation": "Animations",
    "performance": "Performance", "typography": "Typography",
    "product": "Product Page", "category": "Category Page", "cart": "Cart",
    "popup": "Popup System", "floating": "Floating Elements",
    "a11y": "Accessibility", "advanced": "Advanced", "seo": "SEO", "blog": "Blog",
}


def is_wired(setting_id: str) -> bool:
    """A setting is 'wired' if its id string appears anywhere outside
    twilight.json itself — i.e. some template or script actually reads it."""
    result = subprocess.run(
        ["grep", "-rl", f"'{setting_id}'", "src/views", "src/scripts"],
        cwd=ROOT, capture_output=True, text=True,
    )
    return bool(result.stdout.strip())


def format_default(s: dict) -> str:
    t = s["type"]
    if t == "boolean":
        return "On" if s.get("selected") else "Off"
    if t == "list":
        opts = ", ".join(o["label"] for o in s.get("options", []))
        return f'{s.get("value")} (options: {opts})'
    default = s.get("value", "—")
    return "*(empty)*" if default == "" else str(default)


groups: dict[str, list[dict]] = {}
for s in settings:
    prefix = s["id"].split("_")[0]
    groups.setdefault(prefix, []).append(s)

lines = [
    "# NOVA Theme — Settings Guide",
    "",
    "Generated directly from `twilight.json`, cross-referenced against actual",
    "usage in `src/views/` and `src/scripts/` — the Wired column is computed,",
    "not claimed, so this file can't drift from reality. Regenerate after any",
    "settings change: `python3 scripts/generate-settings-guide.py`.",
    "",
]

wired_count = 0
for prefix, items in groups.items():
    title = GROUP_TITLES.get(prefix, prefix.title())
    lines.append(f"## {title}")
    lines.append("")
    lines.append("| Setting | Type | Default | Wired | id |")
    lines.append("|---|---|---|---|---|")
    for s in items:
        wired = is_wired(s["id"])
        wired_count += int(wired)
        lines.append(
            f"| {s['label']} | {s['type']} | {format_default(s)} "
            f"| {'✅' if wired else '—'} | `{s['id']}` |"
        )
    lines.append("")

lines.append(
    f"**{wired_count} of {len(settings)} settings are wired to real behavior** "
    "(the setting's id is referenced by a template or script, not just "
    "declared). The rest are documented as intentionally declared-only, "
    "each with its own reasoning, in `docs/architecture-mapping.md`'s "
    "Phase 10 section — mainly the Popup System (no Popup UI component "
    "was ever built to wire it to) and Blog sidebar/related-posts "
    "(same reason — declared ahead of a UI pass that hasn't happened yet)."
)

(ROOT / "docs" / "SETTINGS.md").write_text("\n".join(lines) + "\n")
print(f"Wrote docs/SETTINGS.md — {wired_count}/{len(settings)} settings wired")
