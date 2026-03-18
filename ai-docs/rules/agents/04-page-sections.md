# Agent 4 Rules: Page Sections

Use these rules together with the Agent 4 section inside `AI-docs/jobs/<page-slug>/tasks.md`.

Developers should not edit this file during normal project execution.

## Scope

Agent 4 owns page sections, drag-and-drop-safe rendering, page-specific implementation, refinement, and approved seeding work.

## Rules

- Work from the active page file and the current section notes when they exist.
- Reuse schema objects and shared blocks from Agents 1 through 3 first.
- Keep sections rendering through the existing page builder mapping.
- Convert one section at a time unless the active scope explicitly covers a full approved page pass.
- Do not manually assemble full pages in route files unless explicit route-level logic is required.
- Match Figma structure using the repository nesting model: `section -> contents -> row -> columns -> column -> nested rows, columns, or contents`.
- Use semantic HTML and accessible heading, landmark, link, and button structure.
- Do not invent or rename tokens during section work.
- Avoid arbitrary values unless unavoidable and justify them.
- Do not use inline styles.
- Use local assets only, not runtime Figma asset URLs.
- Apply `ANIMATION_NOTES` when provided and relevant.
- Keep styling token-first through Tailwind utilities in JSX.
- Keep responsive behavior mobile-first.
- Use `sm:`, `md:`, and `lg:` only unless the project already defines additional breakpoints.
- Do not recreate sections that already exist.
- Keep refinement work minimal-diff. Do not rewrite working sections from scratch during polish.
- Keep behavior and public APIs stable during refinement unless the task explicitly requires a behavioral change.
- Do not add new design tokens during refinement unless the task explicitly changes token scope.
- Do not introduce external animation libraries unless explicitly requested.
- Respect Sanity Visual Editing drag-and-drop requirements for array-based content: render reorderable arrays with client components where needed, preserve stable `_key` values, and attach correct `data-sanity` form paths to array parents and items.
- Use optimistic array rendering for reorderable Visual Editing content where needed so drag-and-drop interactions update predictably.
- Render the Agent 1 schema shape directly: section `contents[]` for top-level rows, row `columns[]`, and column-owned `rows[]`, `columns[]`, or `contents[]` arrays for nested structures.
- Use `stegaClean` for text where required by the rendering path, or preserve enough visual padding around array children so Presentation Tool drag targets remain usable.
- Verify drag and drop for the implemented scope before moving to the next section.
- Every completed page or section must pass desktop and mobile visual review, keyboard and focus-state review, alt text and heading hierarchy review, Visual Editing drag-and-drop verification, `npm run lint`, and `npm run type-check`.
- Create seed work only after approval for the relevant implemented scope.
- When seeding a section, add the required `contents`, row, and column scaffolding defined by the Agent 1 schema and migration contract.
