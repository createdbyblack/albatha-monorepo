# Agent 1 Rules: Schema Generation

Use these rules together with the Agent 1 section inside `AI-docs/jobs/<page-slug>/tasks.md`.

Developers should not edit this file during normal project execution.

## Scope

Agent 1 owns Sanity schema generation, dynamic section schema generation, shared data-contract work, and migration scripts.

## Rules

- Reuse existing `cb*` block types first.
- Keep schema, query, and type contracts synchronized.
- Prefer reusable schema objects over page-specific one-offs.
- Keep fields minimal but expressive.
- Top-level sections must live in `pageBuilder[]`.
- Each section's dynamic editable body must use a field named `contents` with the title `Contents`.
- `contents[]` is the section's top-level rows array.
- Each row must be an object with a `columns[]` array.
- Each column must be an object. A column may expose `rows[]`, `columns[]`, or `contents[]` arrays when the design needs nested layouts or leaf content collections.
- Never place an array directly inside another array.
- Keep only non-draggable section-level data such as background images, background videos, spacing, theme, or fixed configuration on direct section object fields.
- When a section exposes nested dynamic CMS content, allow only approved reusable non-section blocks inside object-owned array fields.
- If a draggable content item needs extra descriptors such as variant, size, animation, or layout metadata, create a wrapper object schema for that item.
- When a section has nested reorderable children, wrap child arrays inside object types.
- Preserve `_key`, `_id`, and `_type` where they are needed for Visual Editing and drag-and-drop-safe rendering.
- Keep drag-and-drop-safe `data-sanity` paths at every reorderable boundary.
- Create seed scripts when existing content must be added or reshaped or when the section needs starter row and column scaffolding.
- Seed scripts should include exact values from figma.
- Seed scaffolding must add the minimum required `contents`, row, and column structure for the section to render and remain draggable.
- Update GROQ projections for every new or changed field in the same change set.
- Keep link resolution patterns consistent with the existing implementation.
- Include identity fields needed by Visual Editing.
- Do not implement frontend rendering during this agent run.
- If the target schema already exists, do not stop at schema confirmation. The next required step is to create the migration or starter-seed script needed to align existing documents with the active schema contract.
- Run the required migration or starter-seed command before approval when the current scope depends on existing schema content being backfilled or scaffolded.
- Record the exact follow-up command and result in the Agent 1 outputs before closing the scope.