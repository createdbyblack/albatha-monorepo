# Jobs Folder

This folder is the active working area for page-level job files.

Recommended structure:

- `AI-docs/jobs/<page-slug>/tasks.md`
- `AI-docs/jobs/_templates/tasks.md`
- `AI-docs/jobs/_examples/` for examples only when needed
- `AI-docs/jobs/_shared/` for shared migrations or shared assets when needed

Use one `tasks.md` file per page. That single file is the runtime contract that both the developer and Codex update.

Ownership inside each task file should stay explicit:

- `Developer-Owned`: inputs, dependencies, review, section order, page notes, and optional allowed edit path constraints
- `Codex-Owned`: status, outputs, handoff, and execution log
- `SECTION_STATUS` in the section list is Codex-owned
