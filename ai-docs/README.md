# AI-docs Guide

This is the single human-facing entrypoint for the Figma-to-Sanity-to-Next.js workflow in this repository.

The repo bootstrap for Codex is the root `AGENTS.md` file. Developers should read this file and update only the active job task file.

## What Developers Should Touch

Developers should edit only:

- `AI-docs/jobs/<page-slug>/tasks.md`

That single file holds:

- shared page and project inputs
- section order
- Agent 1 inputs, status, review, outputs, and handoff
- Agent 2 inputs, status, review, outputs, and handoff
- Agent 3 inputs, status, review, outputs, and handoff
- Agent 4 inputs, status, review, outputs, and handoff

Inside `tasks.md`, follow the ownership labels in the template:

- `Developer-Owned`: inputs, dependencies, review, section order, page notes, and optional allowed edit path constraints
- `Codex-Owned`: status, outputs, handoff, and execution log
- `SECTION_STATUS` in the section list is Codex-owned

Developers should normally not edit:

- `AGENTS.md`
- `AI-docs/references/*`
- `AI-docs/rules/*`
- `AI-docs/jobs/_templates/*`

## System Structure

The docs system is now split clearly:

- `AI-docs/references/`: shared workflow contract, orchestration, and repo context
- `AI-docs/rules/agents/`: static per-agent rules
- `AI-docs/jobs/`: active developer-edited page job files
- `AI-docs/jobs/_templates/`: task file copy starters
- `AI-docs/jobs/_examples/`: examples only when that optional folder exists
- `AI-docs/jobs/_shared/`: shared migrations or shared job assets when that optional folder exists

## Canonical Files

Use these as the active sources of truth:

- `AGENTS.md`: repo-level bootstrap and load order for Codex
- `AI-docs/README.md`: single developer-facing workflow guide
- `AI-docs/references/workflow-reference.md`: prompt syntax, task-file contract, orchestration, handoffs, and global workflow rules
- `AI-docs/references/repo-context.md`: stable repository architecture and router conventions
- `AI-docs/rules/agents/*.md`: static agent rules
- `AI-docs/jobs/<page-slug>/tasks.md`: active job file used by both developer and Codex

## Core Model

The workflow is file-driven:

1. Create or update `AI-docs/jobs/<page-slug>/tasks.md`.
2. Prompt Codex with the canonical command format and the task file path.
3. Review the result and add feedback only in the relevant `Review` section inside the task file.
4. Prompt Codex again with the same command format using the next action.

Developers provide:

- job inputs
- dependency notes and optional edit-path constraints
- review feedback
- one of the allowed prompt actions

Agents update:

- workflow status
- correction rounds
- outputs
- handoff state
- execution history

## Prompt Format

Use this exact syntax:

`Agent <number> do <job-path> <action>`

Recommended job path style:

- `/jobs/homepage/tasks.md`

Path resolution:

- `/jobs/<page-slug>/tasks.md` resolves to `AI-docs/jobs/<page-slug>/tasks.md`

Recommended default actions:

- `start` for a new run
- `review` after you update the `Review` section
- `status` when you want a state readout only

Examples:

- `Agent 1 do /jobs/homepage/tasks.md start`
- `Agent 1 do /jobs/homepage/tasks.md review`
- `Agent 2 do /jobs/homepage/tasks.md start`
- `Agent 3 do /jobs/homepage/tasks.md resume`
- `Agent 4 do /jobs/homepage/tasks.md seed`

## Four-Agent Workflow

### Agent 1

- Static rules: `AI-docs/rules/agents/01-schema.md`
- Runtime location: `AI-docs/jobs/<page-slug>/tasks.md`, Agent 1 section
- Typical prompt: `Agent 1 do /jobs/homepage/tasks.md start`

### Agent 2

- Static rules: `AI-docs/rules/agents/02-design-tokens.md`
- Runtime location: `AI-docs/jobs/<page-slug>/tasks.md`, Agent 2 section
- Typical prompt: `Agent 2 do /jobs/homepage/tasks.md start`

### Agent 3

- Static rules: `AI-docs/rules/agents/03-global-blocks.md`
- Runtime location: `AI-docs/jobs/<page-slug>/tasks.md`, Agent 3 section
- Typical prompt: `Agent 3 do /jobs/homepage/tasks.md start`

### Agent 4

- Static rules: `AI-docs/rules/agents/04-page-sections.md`
- Runtime location: `AI-docs/jobs/<page-slug>/tasks.md`, Agent 4 section
- Typical prompt: `Agent 4 do /jobs/homepage/tasks.md start`

## How To Start

1. Copy `AI-docs/jobs/_templates/tasks.md` to `AI-docs/jobs/<page-slug>/tasks.md`.
2. Fill the shared page and project inputs.
3. Fill the relevant agent input sections.
4. Start the agent with the canonical prompt.

## How To Handle Review, Corrections, And Approval

Developers should not manually update workflow status after a review.

After an agent run:

1. Open `AI-docs/jobs/<page-slug>/tasks.md`.
2. Update only the relevant developer-owned sections, usually the relevant agent `Review` section.
3. Set `REVIEW_DECISION` to `changes-requested` or `approved`.
4. Add details in `REVIEW_NOTES` and `CORRECTION_ITEMS`.
5. Run the follow-up prompt against the same task file.

Examples:

- `Agent 1 do /jobs/homepage/tasks.md correction`
- `Agent 1 do /jobs/homepage/tasks.md approve`
- `Agent 1 do /jobs/homepage/tasks.md review`

The active agent should then update its own section inside `tasks.md`:

- `STATUS`
- `CORRECTION_ROUND`
- `LAST_ACTION`
- `NEXT_ACTION`
- `HANDOFF_READY`
- `NEXT_AGENT`
- `Execution Log`

Accepted scopes should normally end at `STATUS: done`. `STATUS: approved` is optional and should not be left as the resting state for completed accepted work.

## How To Handle Additional Pages

Keep each page in its own job folder:

- `AI-docs/jobs/homepage/tasks.md`
- `AI-docs/jobs/about/tasks.md`
- `AI-docs/jobs/contact/tasks.md`

When page 1 is done:

1. Leave its folder in place as the execution record.
2. Copy the template for the next page.
3. Fill the new page's inputs and section order.
4. Run the next agent against that new task file.

Do not overwrite the previous page files.
