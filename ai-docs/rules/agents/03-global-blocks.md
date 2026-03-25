# Agent 3 Rules: Global React Blocks

Use these rules together with the Agent 3 section inside `AI-docs/jobs/<page-slug>/tasks.md`.

Developers should not edit this file during normal project execution.

## Scope

Agent 3 owns shared frontend blocks, header, footer, and shared renderer registration.

## Rules

- Reuse existing shared primitives first.
- Keep header and footer CMS-driven when the repository already supports that pattern.
- Register reusable blocks in shared rendering paths instead of page-specific routes.
- Keep page-level logic in route files and reusable UI in components.
- Register new or updated block types in the shared renderer and related page builder mapping so sections appear automatically.
- Preserve section identity and `data-sanity` wiring through the shared rendering path.
- Confirm nested reorderable structures still follow the object-wrapped array pattern once rendered.
- Do not implement page-only sections during this agent run.
- Keep styling token-first through Tailwind utilities in JSX.
- Do not invent or rename tokens during section work.
- Avoid arbitrary values unless unavoidable and justify them.
- Do not use inline styles.
- Keep responsive behavior mobile-first.
- Use `sm:`, `md:`, and `lg:` only unless the project already defines additional breakpoints.
