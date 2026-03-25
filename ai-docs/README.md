# AI-docs Guide

This is the developer-facing entrypoint for the Figma-to-Sanity-to-Next.js workflow in this repository.

The root `AGENTS.md` file is the Codex bootstrap. As a developer, your main working file is `AI-docs/jobs/<page-slug>/tasks.md`.

## What To Edit

Edit only:

- `AI-docs/jobs/<page-slug>/tasks.md`

That one file contains:

- shared page and project inputs
- section order
- agent-specific inputs and dependencies
- the developer `Decision` sections
- agent-owned status, outputs, handoff, and execution log

Inside `tasks.md`:

- `Developer-Owned`: inputs, dependencies, decision, section order, page notes, and optional allowed edit path constraints
- `Codex-Owned`: status, outputs, handoff, and execution log
- `SECTION_STATUS` is Codex-owned

Developers should normally not edit:

- `AGENTS.md`
- `AI-docs/references/*`
- `AI-docs/rules/*`
- `AI-docs/jobs/_templates/*`

## Folder Map

- `AI-docs/references/`: workflow contract and repo context
- `AI-docs/rules/agents/`: static rules per agent
- `AI-docs/jobs/`: live page job files
- `AI-docs/jobs/_templates/`: task starter

## Standard Workflow

1. Copy `AI-docs/jobs/_templates/tasks.md` to `AI-docs/jobs/<page-slug>/tasks.md`.
2. Fill the shared inputs and the active agent inputs.
3. Run `start`.
4. Update the active agent `Decision` section.
5. Run `correction` or `approve`.
6. Run `seed` only when approved seeding is explicitly needed.

Exact prompt format:

`Agent <number> do <job-path> <action>`

Path rule:

- `/jobs/<page-slug>/tasks.md` resolves to `AI-docs/jobs/<page-slug>/tasks.md`

Example:

- `Agent 1 do /jobs/homepage/tasks.md start`

Optional utility prompt:

- `status` gives a readout only and does not start implementation work

## Decision Loop

After any agent run:

1. Open the same `tasks.md` file.
2. Update the relevant `Decision` section only.
3. Set `DECISION` to `changes-requested` or `approved`.
4. Add details in `NOTES` and `CORRECTION_ITEMS`.
5. Run `correction` or `approve`.

Agents own:

- `STATUS`
- `CORRECTION_ROUND`
- `LAST_ACTION`
- `NEXT_ACTION`
- `HANDOFF_READY`
- `NEXT_AGENT`
- `Execution Log`

## Agent Order

Default order:

1. Agent 1
2. Agent 2
3. Agent 3
4. Agent 4

## Prompt Catalog

Use these exact prompts. Replace `homepage` with your page slug when needed.

### Agent 1: Schema Generation

- Start: `Agent 1 do /jobs/homepage/tasks.md start`
- Correction: `Agent 1 do /jobs/homepage/tasks.md correction`
- Approve: `Agent 1 do /jobs/homepage/tasks.md approve`
- Seed: `Agent 1 do /jobs/homepage/tasks.md seed`
- Status: `Agent 1 do /jobs/homepage/tasks.md status`

Use Agent 1 for schema objects, section modeling, query updates, generated types, migrations, and starter structure backfills.

Important approval rule:

- if the schema already exists, Agent 1 is not done after confirming the schema shape
- the next required step is to create the migration or starter-seed script, run it, and record the command/result in the task file before `approve`

### Agent 2: Design Tokens

- Start: `Agent 2 do /jobs/homepage/tasks.md start`
- Correction: `Agent 2 do /jobs/homepage/tasks.md correction`
- Approve: `Agent 2 do /jobs/homepage/tasks.md approve`
- Seed: `Agent 2 do /jobs/homepage/tasks.md seed`
- Status: `Agent 2 do /jobs/homepage/tasks.md status`

Use Agent 2 for Figma token extraction, Tailwind v4 `@theme` setup, semantic token mapping, and font setup.

### Agent 3: Global Blocks

- Start: `Agent 3 do /jobs/homepage/tasks.md start`
- Correction: `Agent 3 do /jobs/homepage/tasks.md correction`
- Approve: `Agent 3 do /jobs/homepage/tasks.md approve`
- Seed: `Agent 3 do /jobs/homepage/tasks.md seed`
- Status: `Agent 3 do /jobs/homepage/tasks.md status`

Use Agent 3 for shared React blocks, header, footer, shared renderer registration, and reusable CMS-driven frontend pieces.

### Agent 4: Page Sections

- Start: `Agent 4 do /jobs/homepage/tasks.md start`
- Correction: `Agent 4 do /jobs/homepage/tasks.md correction`
- Approve: `Agent 4 do /jobs/homepage/tasks.md approve`
- Seed: `Agent 4 do /jobs/homepage/tasks.md seed`
- Status: `Agent 4 do /jobs/homepage/tasks.md status`

Use Agent 4 for page sections, page-builder rendering, drag-and-drop-safe Visual Editing support, and approved section seeding.

## When To Use Each Action

- `start`: first implementation pass for the active scope
- `correction`: follow-up pass after you set `DECISION: changes-requested`
- `approve`: finalization pass after you set `DECISION: approved`
- `seed`: approved seeding only, not new implementation work
- `status`: readout only

## Multiple Pages

Keep each page in its own job folder:

- `AI-docs/jobs/homepage/tasks.md`
- `AI-docs/jobs/about/tasks.md`
- `AI-docs/jobs/contact/tasks.md`

When one page is done:

1. Leave its folder in place as the execution record.
2. Copy the template for the next page.
3. Fill the new page inputs.
4. Run the next agent against that new task file.

Do not overwrite previous page files.
