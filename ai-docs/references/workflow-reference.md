# Workflow Reference

Use this file as the shared workflow contract for developer prompts, task-file inputs, and cross-agent rules.

## Prompt Contract

Use this prompt format for all developer-triggered agent runs:

`Agent <number> do <job-path> <action>`

### Allowed Agent Numbers

- `1`
- `2`
- `3`
- `4`

### Agent Rule Mapping

- Agent 1 -> `AI-docs/rules/agents/01-schema.md`
- Agent 2 -> `AI-docs/rules/agents/02-design-tokens.md`
- Agent 3 -> `AI-docs/rules/agents/03-global-blocks.md`
- Agent 4 -> `AI-docs/rules/agents/04-page-sections.md`

### Job Path

- `job-path`: repo-relative alias under `AI-docs`, usually `/jobs/<page-slug>/tasks.md`
- `/jobs/<page-slug>/tasks.md` resolves to `AI-docs/jobs/<page-slug>/tasks.md`

### Allowed Actions

The standard working set is:

- `start`
- `correction`
- `approve`
- `seed`

`status` is optional when the developer wants a readout only.

#### `start`

Use for the first implementation pass of the current scoped task.

Developer must do this before prompting:

- create or update the active task file
- fill the required inputs for the current agent
- make sure the current scope and dependencies are accurate

Expected behavior:

- read the active agent rule file
- read the active task file
- start implementation for the current scope
- update status and outputs when done
- leave the scope at `STATUS: awaiting-decision` when developer input is needed next

#### `correction`

Use after the developer requests changes in the active task file.

Developer must do this before prompting:

- open the active task file
- set `DECISION: changes-requested`
- add clear correction items in `CORRECTION_ITEMS`
- add any supporting notes in `NOTES`

Expected behavior:

- read the active agent rule file
- read the `Decision` section
- apply requested corrections
- update status, correction round, outputs, and execution log
- return the scope to `STATUS: awaiting-decision` when the correction pass is complete

#### `approve`

Use after the implementation is accepted and the developer has recorded approval in the active task file.

Developer must do this before prompting:

- set `DECISION: approved`
- add any approval notes that should remain in the record
- make sure no unresolved correction items remain in the active scope

Expected behavior:

- read the active agent rule file
- record approval
- set handoff readiness
- set the next agent when applicable
- close the current scope at `STATUS: done`

Agent 1 approval gate:

- when the schema already exists and the remaining work is content-shape alignment, Agent 1 must create the required migration or starter-seed script, run it, and record the command and outcome before `approve`

#### `seed`

Use only when approved seeding work is allowed for the active scope.

Developer must do this before prompting:

- confirm the related implementation scope is already approved
- confirm the active files identify the exact approved page or section scope
- add any approved content notes needed for seeding
- make sure the prompt is not being used to request new implementation work

Expected behavior:

- read the active agent rule file
- create or update seed work for approved content only
- avoid unapproved implementation changes

Note for Agent 1:

- migration or starter-seed scripts that are required to make an existing schema usable are implementation work and should happen during `start` or `correction`, not during the post-approval `seed` action

#### `status`

Use when the developer wants a state readout without asking the agent to implement new work.

Expected behavior:

- read the active agent rule file
- summarize the current status of the active files
- do not implement new work

### Canonical Examples

- `Agent 1 do /jobs/homepage/tasks.md start`
- `Agent 1 do /jobs/homepage/tasks.md correction`
- `Agent 1 do /jobs/homepage/tasks.md approve`
- `Agent 1 do /jobs/homepage/tasks.md status`
- `Agent 2 do /jobs/homepage/tasks.md start`
- `Agent 3 do /jobs/homepage/tasks.md correction`
- `Agent 4 do /jobs/homepage/tasks.md seed`
- `Agent 4 do /jobs/homepage/tasks.md status`

### Default Recommendation

Most developer interactions should use only these four actions:

- `start`
- `correction`
- `approve`
- `seed`

Use `status` only when the next step is a readout instead of implementation work.

## Input Contract

Use this shared input contract for the four-agent workflow. Populate only the fields relevant to the current agent and current page scope.

### Required Project Inputs

- `PROJECT_NAME`: human-readable project name
- `PROJECT_FIGMA_URL`: Figma file URL that contains the design system and page source of truth
- `LOCALE_SCOPE`: locale scope for the implementation

### Common Optional Project Inputs

- `DESIGN_SYSTEM_NODE_URL`: Figma node for the design system source
- `PRIMARY_FRONTEND_ROOT`: frontend root when a project uses a non-default path
- `PRIMARY_STUDIO_ROOT`: studio root when a project uses a non-default path
- `ALLOWED_EDIT_PATHS`: explicit allowlist when tighter file control is required

### Agent-Specific Inputs

#### Agent 1

- `SCHEMA_TARGETS`
- `PAGES_IN_SCOPE`
- `MIGRATION_TARGETS`
- `EXISTING_SCHEMA_FOLLOW_UP`
- `REUSE_PRIORITY`

#### Agent 2

- `TOKEN_SOURCE_FILES`
- `FONT_SOURCE_NOTES`
- `SEMANTIC_TOKEN_TARGETS`

#### Agent 3

- `HEADER_NODE_URL`
- `FOOTER_NODE_URL`
- `GLOBAL_BLOCKS_IN_SCOPE`

#### Agent 4

- `ACTIVE_SECTION`
- `TARGET_NODE_URL`
- `SECTIONS_IN_SCOPE`
- `SEEDING_SCOPE`

Agent 4 also relies on the shared page inputs already present in the task file, especially:

- `PAGE_SLUG`
- `TARGET_PAGE_NODE_URL`

### Page Inputs

- `PAGE_NAME`
- `PAGE_SLUG`
- `NEXT_ROUTE`
- `SANITY_PAGE_TYPE`
- `TARGET_PAGE_NODE_URL`

### Section Inputs

- `SECTION_NAME`
- `TARGET_NODE_URL`
- `ANIMATION_NOTES`
- `MODELING_NOTES`
- `SCHEMA_NOTES`
- `SEEDING_NOTES`

### Decision Inputs

Developers should use these fields in the relevant agent section of the active task file after a run:

- `DECISION`: `pending`, `changes-requested`, or `approved`
- `DECIDED_BY`
- `DECISION_DATE`
- `NOTES`
- `CORRECTION_ITEMS`

### Status Fields

Agents own these fields and should update them after each run:

- `STATUS`
- `CORRECTION_ROUND`
- `LAST_ACTION`
- `NEXT_ACTION`
- `HANDOFF_READY`
- `NEXT_AGENT`

### Ownership Summary

Use these ownership rules inside `AI-docs/jobs/<page-slug>/tasks.md`:

- Developers own shared inputs, section order, shared notes, agent inputs, dependencies, decision sections, and optional allowed edit path constraints
- Agents own status, outputs, handoff, and execution log sections
- In the section list, developers own section names and target nodes, while agents own `SECTION_STATUS`
- Developers should not manually edit agent-owned sections unless a workflow document explicitly says otherwise

### Notes

- The same project-level Figma URL may be reused across many page jobs.
- Page 1, page 2, and later pages should each have their own folder under `AI-docs/jobs/`.
- Section work should not start until the shared token and font baseline is established unless the workflow explicitly allows overlap.
- Seed work should not start until the implementation scope is approved.
- Agent 1 may create migration scripts earlier when they are required to support schema changes, dynamic section scaffolding, or content reshaping.
- If `SCHEMA_TARGETS` already exist, Agent 1 should treat `EXISTING_SCHEMA_FOLLOW_UP` and `MIGRATION_TARGETS` as active implementation work and should not stop at schema confirmation alone.

## Dynamic Section Modeling Contract

- Top-level sections must remain array members in `pageBuilder[]`.
- Agent 1 owns the section schema objects and any required migration scripts for nested dynamic section structures.
- A section's dynamic editable body should use a field named `contents` with the title `Contents`.
- `contents[]` is the section's top-level rows array.
- Each row must be an object with a `columns[]` array.
- Each column must be an object. A column may expose `rows[]`, `columns[]`, or `contents[]` arrays when the design needs nested layouts or leaf content collections.
- Never place an array directly inside another array. Nested arrays must always live on object types so Visual Editing drag and drop has stable targets.
- Additional section fields should exist only when the section needs fixed render configuration such as background image, background video, spacing, theme, or other non-reorderable settings.
- Seed or migration scripts should scaffold the minimum required row and column structure for the section.
- Agent 4 must render reorderable arrays in a Visual Editing compatible way, including stable `_key` usage, correct `data-sanity` form paths, and client-side optimistic array rendering where needed.

## Four-Agent Orchestration

Use this section as the orchestration contract for the repository workflow.

### Agent Topology

#### Agent 1

- Name: Schema Generation
- Primary scope: Sanity schema objects, dynamic section schema types, structure wiring, GROQ projections, generated type contracts, and migration scripts
- Primary areas: `studio/` and shared Sanity query and type files in `frontend/`

#### Agent 2

- Name: Design Tokens
- Primary scope: token extraction, Tailwind v4 `@theme` setup, font setup, semantic token mapping
- Primary areas: `frontend/app/globals.css`, `frontend/app/layout.tsx`, shared token wiring

#### Agent 3

- Name: Global React Blocks
- Primary scope: shared frontend blocks, header, footer, reusable CMS-driven components, shared renderer support
- Primary areas: shared React components and related shared Sanity block integration

#### Agent 4

- Name: Page Sections
- Primary scope: page-specific section implementation, drag-and-drop-safe rendering, page builder mapping, and approved section seeding
- Primary areas: page-specific schema and frontend section work

### Recommended Execution Order

Recommended default order:

1. Agent 1
2. Agent 2
3. Agent 3
4. Agent 4

Agent 2 may run in parallel with Agent 1 when token work is independent from schema naming decisions. Agent 3 should wait for Agent 1 and Agent 2. Agent 4 should wait for the outputs of Agents 1 through 3.

### Handoff Contracts

#### Agent 1 -> Agent 2

Agent 1 should leave:

- final schema naming decisions
- final dynamic section shape decisions for `contents`, rows, columns, and nested arrays
- reusable object definitions added or confirmed
- query, type, and migration-script changes that token or block work must respect

#### Agent 2 -> Agent 3

Agent 2 should leave:

- approved semantic token names
- font setup decisions
- token usage constraints for shared components

#### Agent 3 -> Agent 4

Agent 3 should leave:

- shared component inventory
- block renderer registrations
- header and footer integration state
- reusable block patterns Agent 4 should reuse before adding new page-specific code
- any shared Visual Editing constraints needed for drag-and-drop-safe rendering

### Decision Workflow

Every agent follows the same lifecycle:

1. `ready`
2. `in-progress`
3. `awaiting-decision`
4. `revising`
5. `done`

`blocked` may be used at any time when a prerequisite is missing.

Developers should edit only the relevant developer-owned sections in `AI-docs/jobs/<page-slug>/tasks.md` after a run, usually the relevant `Decision` section.

Developers should not manually change:

- `STATUS`
- `CORRECTION_ROUND`
- `HANDOFF_READY`
- `NEXT_AGENT`

The active agent must update those fields after each run.

Agent 1 special case:

- if the schema already exists and the remaining work is migration or starter-structure backfill, the agent should stay in implementation mode until the migration or seed script has been created and run
- Agent 1 should record the exact command and the result in the task file before approval is finalized

### Page Handling

Page-specific runtime state belongs in `AI-docs/jobs/<page-slug>/tasks.md`.

When page 1 is complete, keep its task file as the execution record and create a sibling folder for page 2. Do not overwrite the previous page files.

### Seeding Rule

Agent 4 or the active implementation agent may create seeding work only after the relevant implementation scope is approved.

Do not create content seeds during an implementation run that is still awaiting decision.
Migration scripts remain Agent 1 responsibility and may be created earlier when the schema contract requires them.
When a section needs starter structure, the seed should add the required `contents`, row, and column scaffolding defined by Agent 1.

## Global Execution Rules

These rules apply to every Figma-to-page implementation run in this repository.

Agent-specific implementation rules belong in `AI-docs/rules/agents/`, and the live runtime scope belongs in `AI-docs/jobs/<page-slug>/tasks.md`.

### Global Rules

- Read only the bootstrap context listed in `AGENTS.md` by default.
- Read the active agent rule file and active task file only when the requested action needs runtime scope.
- Use the prompt syntax defined in this file.
- Reuse existing schema objects, page-builder blocks, queries, and React primitives first.
- Model dynamic section content with `contents[]` -> `columns[]` -> nested `rows[]`, `columns[]`, or `contents[]` arrays on object types only.
- Keep schema, query, type, renderer, and route changes synchronized.
- Keep page routes thin and rely on the CMS-driven page builder mapping for section output unless explicit route-level logic is required.
- Preserve locale behavior unless the task explicitly changes it.
- Preserve Draft Mode, Presentation Tool, and Visual Editing compatibility.
- Keep section schemas and rendering aligned with Sanity Visual Editing drag-and-drop requirements for array-based content and form-path-safe `data-sanity` targets.
- Keep shared non-trivial TypeScript types in separate importable files.
- Treat the active task file as the runtime contract for the current run.
- Agents own workflow status updates. Developers should supply inputs and decision feedback only.
