# Page Task Template

Copy this file to `AI-docs/jobs/<page-slug>/tasks.md`.

Developers and Codex both update this file. Follow the ownership labels in each section.

## Ownership Rules

- `Developer-Owned`: developers may edit these sections directly
- `Codex-Owned`: developers should not edit these sections during normal workflow runs
- `Allowed Edit Paths`: developer-owned when constraining scope for a run
- `Execution Log`: Codex-owned unless a workflow doc explicitly requires a manual note
- `SECTION_STATUS`: Codex-owned even though the section list itself is developer-owned

## Shared Inputs `(Developer-Owned)`

```md
PROJECT_NAME:
PAGE_NAME:
PAGE_SLUG:
NEXT_ROUTE:
SANITY_PAGE_TYPE:
PROJECT_FIGMA_URL:
DESIGN_SYSTEM_NODE_URL:
TARGET_PAGE_NODE_URL:
LOCALE_SCOPE:
```

## Section Order `(Developer-Owned, except SECTION_STATUS which is Codex-Owned)`

```md
1. SECTION_NAME:
   TARGET_NODE_URL:
   SECTION_STATUS: planned | in-progress | awaiting-decision | done | blocked

2. SECTION_NAME:
   TARGET_NODE_URL:
   SECTION_STATUS: planned | in-progress | awaiting-decision | done | blocked
```

## Shared Notes `(Developer-Owned)`

```md
PAGE_NOTES:
GLOBAL_NOTES:
```

## Agent 1

### Inputs `(Developer-Owned)`

```md
PAGES_IN_SCOPE:
SCHEMA_TARGETS:
MIGRATION_TARGETS:
EXISTING_SCHEMA_FOLLOW_UP: none | migration | seed | migration-and-seed
REUSE_PRIORITY:
NOTES:
```

### Dependencies `(Developer-Owned)`

```md
BLOCKERS:
```

### Allowed Edit Paths `(Developer-Owned, optional)`

```md
- studio/src/schemaTypes/
- studio/src/structure/
- frontend/sanity/lib/queries.ts
- frontend/sanity/lib/types.ts
- AI-docs/jobs/\_shared/migrations/
- sanity.schema.json
```

### Status `(Codex-Owned)`

```md
STATUS: ready | in-progress | awaiting-decision | revising | done | blocked
CORRECTION_ROUND: 0
LAST_ACTION:
NEXT_ACTION:
HANDOFF_READY: no
NEXT_AGENT: Agent 2 | Agent 3 | Agent 4 | none
```

### Decision `(Developer-Owned)`

```md
DECISION: pending | changes-requested | approved
DECIDED_BY:
DECISION_DATE:
NOTES:
CORRECTION_ITEMS:
```

### Outputs `(Codex-Owned)`

```md
SCHEMA_FILES_UPDATED:
QUERY_CHANGES:
TYPE_CHANGES:
MIGRATION_CHANGES:
FOLLOW_UP_COMMANDS_RUN:
FOLLOW_UP_RESULTS:
SECTION_SHAPE_DECISIONS:
OPEN_DECISIONS:
```

### Handoff `(Codex-Owned)`

```md
HANDOFF_SUMMARY:
REQUIRED_NEXT_STEPS:
CONSTRAINTS_FOR_NEXT_AGENT:
```

## Agent 2

### Inputs `(Developer-Owned)`

```md
TOKEN_SOURCE_FILES:
FONT_SOURCE_NOTES:
SEMANTIC_TOKEN_TARGETS:
NOTES:
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
STATUS: ready | in-progress | awaiting-decision | revising | done | blocked
CORRECTION_ROUND: 0
LAST_ACTION:
NEXT_ACTION:
HANDOFF_READY: no
NEXT_AGENT: Agent 3 | Agent 4 | none
```

### Decision `(Developer-Owned)`

```md
DECISION: pending | changes-requested | approved
DECIDED_BY:
DECISION_DATE:
NOTES:
CORRECTION_ITEMS:
```

### Outputs `(Codex-Owned)`

```md
TOKEN_FILES_UPDATED:
FONT_FILES_UPDATED:
TOKEN_NAMING_DECISIONS:
AMBIGUITIES_AND_INCONSISTENCIES:
OPEN_DECISIONS:
```

### Handoff `(Codex-Owned)`

```md
HANDOFF_SUMMARY:
REQUIRED_NEXT_STEPS:
CONSTRAINTS_FOR_NEXT_AGENT:
```

## Agent 3

### Inputs `(Developer-Owned)`

```md
HEADER_NODE_URL:
FOOTER_NODE_URL:
GLOBAL_BLOCKS_IN_SCOPE:
REUSE_PRIORITY:
NOTES:
```

### Dependencies `(Developer-Owned)`

```md
BLOCKERS:
```

### Allowed Edit Paths `(Developer-Owned, optional)`

```md
- frontend/app/components/
- frontend/app/layout.tsx
- frontend/app/globals.css
- frontend/sanity/lib/queries.ts
- frontend/sanity/lib/types.ts
- studio/src/schemaTypes/
- studio/src/structure/
```

### Status `(Codex-Owned)`

```md
STATUS: ready | in-progress | awaiting-decision | revising | done | blocked
CORRECTION_ROUND: 0
LAST_ACTION:
NEXT_ACTION:
HANDOFF_READY: no
NEXT_AGENT: Agent 4 | none
```

### Decision `(Developer-Owned)`

```md
DECISION: pending | changes-requested | approved
DECIDED_BY:
DECISION_DATE:
NOTES:
CORRECTION_ITEMS:
```

### Outputs `(Codex-Owned)`

```md
SCHEMA_FILES_UPDATED:
SHARED_COMPONENTS_UPDATED:
RENDERER_CHANGES:
OPEN_DECISIONS:
```

### Handoff `(Codex-Owned)`

```md
HANDOFF_SUMMARY:
REQUIRED_NEXT_STEPS:
CONSTRAINTS_FOR_NEXT_AGENT:
```

## Agent 4

### Inputs `(Developer-Owned)`

```md
ACTIVE_SECTION:
TARGET_NODE_URL:
SECTIONS_IN_SCOPE:
SEEDING_SCOPE:
NOTES:
```

### Dependencies `(Developer-Owned)`

```md
BLOCKERS:
```

### Allowed Edit Paths `(Developer-Owned, optional)`

```md
- frontend/app/components/
- frontend/app/[...segments]/
- frontend/app/page.tsx
- frontend/sanity/lib/queries.ts
- frontend/sanity/lib/types.ts
- studio/src/schemaTypes/
- studio/src/structure/
- AI-docs/jobs/
- AI-docs/jobs/\_shared/
```

### Status `(Codex-Owned)`

```md
STATUS: ready | in-progress | awaiting-decision | revising | done | blocked
CORRECTION_ROUND: 0
LAST_ACTION:
NEXT_ACTION:
HANDOFF_READY: no
NEXT_AGENT: none
```

### Decision `(Developer-Owned)`

```md
DECISION: pending | changes-requested | approved
DECIDED_BY:
DECISION_DATE:
NOTES:
CORRECTION_ITEMS:
```

### Outputs `(Codex-Owned)`

```md
PAGES_UPDATED:
SECTIONS_UPDATED:
SCHEMA_FILES_UPDATED:
RENDERER_CHANGES:
SEEDING_CHANGES:
RESPONSIVE_DECISIONS:
TOKEN_USAGE_SUMMARY:
ARBITRARY_VALUE_JUSTIFICATIONS:
DRAG_AND_DROP_NOTES:
OPEN_DECISIONS:
```

### Handoff `(Codex-Owned)`

```md
HANDOFF_SUMMARY:
REQUIRED_NEXT_STEPS:
CONSTRAINTS_FOR_NEXT_AGENT:
```

## Execution Log `(Codex-Owned)`

```md
- YYYY-MM-DD: Task file created.
```
