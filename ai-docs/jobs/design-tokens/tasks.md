# Page Task Template

Developers and Codex both update this file. Follow the ownership labels in each section.

## Ownership Rules

- `Developer-Owned`: developers may edit these sections directly
- `Codex-Owned`: developers should not edit these sections during normal workflow runs
- `Allowed Edit Paths`: developer-owned when constraining scope for a run
- `Execution Log`: Codex-owned unless a workflow doc explicitly requires a manual note
- `SECTION_STATUS`: Codex-owned even though the section list itself is developer-owned

## Shared Inputs `(Developer-Owned)`

```md
PROJECT_NAME: Albatha Website
PAGE_NAME: N/A
PAGE_SLUG: N/A
NEXT_ROUTE: N/A
SANITY_PAGE_TYPE: N/A
PROJECT_FIGMA_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=1-2&p=f&m=dev
DESIGN_SYSTEM_NODE_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=1-2&p=f&m=dev
TARGET_PAGE_NODE_URL: N/A
LOCALE_SCOPE: N/A
```

## Shared Notes `(Developer-Owned)`

```md
PAGE_NOTES: N/A
GLOBAL_NOTES: N/A
```

## Agent 2

### Inputs `(Developer-Owned)`

```md
TOKEN_SOURCE_FILES: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=1-2&p=f&m=dev
FONT_SOURCE_NOTES: N/A
SEMANTIC_TOKEN_TARGETS: N/A
NOTES: N/A
```

### Dependencies `(Developer-Owned)`

```md
BLOCKERS:
```

### Allowed Edit Paths `(Developer-Owned, optional)`

```md
- frontend/app/globals.css
- frontend/app/layout.tsx
- frontend/app/
- frontend/app/lib/
```

### Status `(Codex-Owned)`

```md
STATUS: done
CORRECTION_ROUND: 1
LAST_ACTION: approve
NEXT_ACTION: Agent 3 start
HANDOFF_READY: yes
NEXT_AGENT: Agent 3
```

### Review `(Developer-Owned)`

```md
REVIEW_DECISION: approved
REVIEW_DATE:
REVIEW_NOTES:
CORRECTION_ITEMS:
```

### Outputs `(Codex-Owned)`

```md
TOKEN_FILES_UPDATED: frontend/app/globals.css
FONT_FILES_UPDATED: frontend/app/globals.css; frontend/app/layout.tsx
TOKEN_NAMING_DECISIONS: Preserved the existing semantic token surface already consumed by the frontend (`background`, `foreground`, `surface`, `surface-strong`, `border`, `accent`, `primary`, `secondary`, `button-*`, `copy-*`, `cover-*`) and remapped it to Figma-backed Albatha primitives (`--color-albatha-*`). Added `--font-brand` as the sitewide SUSE family token and aligned `font-sans` and `font-mono` to it.
AMBIGUITIES_AND_INCONSISTENCIES: Figma variables only define four brand colors, so neutral surface and border tokens were sourced from explicit fills and strokes found in the file (`#f9f9f9`, `#dde1e5`, `#ffffff`). The review resolved the sitewide font choice to SUSE, so the frontend now loads SUSE directly from `next/font/google`.
OPEN_DECISIONS: Confirm whether the light secondary button treatment should remain the shared semantic default or be replaced by a more branded alternate in a later review.
```

### Handoff `(Codex-Owned)`

```md
HANDOFF_SUMMARY: The frontend token baseline now reflects the Figma palette, content widths, cover heights, and the reviewed sitewide SUSE font setup while keeping the current semantic class names stable for downstream component work.
REQUIRED_NEXT_STEPS: Agent 3 should build shared blocks against the existing semantic color and SUSE-based typography tokens instead of adding new hardcoded palette values.
CONSTRAINTS_FOR_NEXT_AGENT: Use the current semantic tokens and treat SUSE as the sitewide brand family. Reuse the existing global theme names before proposing new ones.
```

## Execution Log `(Codex-Owned)`

```md
- YYYY-MM-DD: Task file created.
- 2026-03-25: Agent 2 `start` remapped the frontend theme to Figma-backed Albatha primitives, aligned font tokens to the Figma brand family with safe fallbacks, and left the run in `awaiting-review`.
- 2026-03-25: Agent 2 `review` applied the requested font correction by loading SUSE sitewide through `next/font/google`, updated the font tokens, and returned the run to `awaiting-review`.
- 2026-03-25: Agent 2 `approve` finalized the token and font baseline, marked the scope `done`, and handed off to Agent 3.
```
