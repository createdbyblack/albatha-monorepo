# Repository Agent Guide

This file is the repo-level bootstrap for the Figma-to-Sanity-to-Next.js workflow in this repository.

Use this file as the first repo-specific instruction source. Keep detailed implementation rules in `AI-docs`.

## Canonical Sources

Load repo context in this order:

1. `AGENTS.md`
2. `AI-docs/references/workflow-reference.md`
3. `AI-docs/references/repo-context.md`

Do not load unrelated project, page, section, or legacy job files unless the current task depends on them.

## Runtime Context

Read these only when the requested action needs them:

1. the mapped agent rule file:
   - Agent 1 -> `AI-docs/rules/agents/01-schema.md`
   - Agent 2 -> `AI-docs/rules/agents/02-design-tokens.md`
   - Agent 3 -> `AI-docs/rules/agents/03-global-blocks.md`
   - Agent 4 -> `AI-docs/rules/agents/04-page-sections.md`
2. The active task file at `AI-docs/jobs/<page-slug>/tasks.md`

Typical runtime actions include `start`, `review`, `correction`, `approve`, `resume`, `seed`, and `status`.

## Workflow Model

This repository uses a four-agent workflow:

1. Agent 1: Sanity schema generation, section modeling, and migration scripts
2. Agent 2: design token and font setup
3. Agent 3: shared Next.js and React blocks, including header and footer
4. Agent 4: page sections, drag-and-drop-safe rendering, and page-specific implementation

Use the active task file as the runtime contract for the current run. That file should contain the shared inputs plus the relevant agent inputs, dependencies, allowed edit paths, review state, and handoff state.

## Developer Participation

Developers should not retype long prompts once the project files exist.

Developer responsibilities:

- Fill or update the active task file at `AI-docs/jobs/<page-slug>/tasks.md`
- Add review feedback in the relevant `Review` section inside that task file
- Edit only developer-owned sections in the task template

## Prompt Contract

Use this exact prompt format:

`Agent <number> do <job-path> <action>`

`job-path` is the repo-relative alias under `AI-docs`.

Example:

- `/jobs/homepage/tasks.md` resolves to `AI-docs/jobs/homepage/tasks.md`

Allowed agent numbers:

- `1`
- `2`
- `3`
- `4`

Allowed actions:

- `start`: begin the agent's current scoped task from the active task file
- `review`: read the `Review` section and respond to the current review decision
- `correction`: apply requested corrections from the `Review` section
- `approve`: finalize approved work, update handoff state, and close the current scope
- `resume`: continue interrupted or blocked work when no new review was added
- `seed`: create approved seeding work for the active scope when seeding is allowed
- `status`: report the current state of the active task file without starting new implementation work
- `job-path`: repo-relative alias under `AI-docs`, usually `/jobs/<page-slug>/tasks.md`

Detailed action behavior, input fields, and global workflow rules live in `AI-docs/references/workflow-reference.md`.

Canonical examples:

- `Agent 1 do /jobs/homepage/tasks.md start`
- `Agent 1 do /jobs/homepage/tasks.md review`
- `Agent 1 do /jobs/homepage/tasks.md correction`
- `Agent 1 do /jobs/homepage/tasks.md approve`
- `Agent 4 do /jobs/homepage/tasks.md seed`

Prefer `review` after the developer updates the `Review` section. `correction` and `approve` are explicit alternatives when the desired next step is already known.

## Status Ownership

The agent owns workflow status.

Developers should edit only:

- `Inputs`
- `Dependencies` when they are supplying missing prerequisites
- `Allowed Edit Paths` when they need to tighten scope
- `Review`
- section order and page notes in the active task file when needed

In the section list, developers should edit section names and target nodes only. `SECTION_STATUS` is agent-owned.

Agents should update:

- `Status`
- `Outputs`
- `Handoff To Next Agent`
- `Execution Log`

Do not require the developer to manually change workflow status after corrections or approvals.

## Corrections And Approval

Use this review loop for every agent:

1. Agent completes work and sets `STATUS: awaiting-review`
2. Developer adds either `REVIEW_DECISION: changes-requested` or `REVIEW_DECISION: approved`
3. Developer adds notes under `REVIEW_NOTES` and `CORRECTION_ITEMS`
4. Agent applies the review, updates status, and records the new correction round
5. When the scope is accepted and complete, the agent closes it with `STATUS: done` and `HANDOFF_READY: yes`

`STATUS: approved` may be used as a brief internal or transitional state, but the repository default is to end accepted scopes at `done`.

## AI-docs Structure

`AI-docs/README.md` is now the single developer-facing workflow guide and AI-docs map.

The active operating structure is:

- `AI-docs/references/`: shared workflow contract, orchestration, and repo context
- `AI-docs/rules/agents/*.md`: static per-agent rules
- `AI-docs/jobs/<page-slug>/tasks.md`: developer-edited runtime task files
- `AI-docs/jobs/_templates/`: task copy starters

`AI-docs/jobs/` is now the canonical working area.
