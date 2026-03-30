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
PROJECT_NAME: Homepage
PAGE_NAME: homepage
PAGE_SLUG: /
NEXT_ROUTE: /
SANITY_PAGE_TYPE: homePage
PROJECT_FIGMA_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=1-874&m=dev
DESIGN_SYSTEM_NODE_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=1-874&m=dev
TARGET_PAGE_NODE_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=1-874&m=dev
LOCALE_SCOPE:
```

## Section Order `(Developer-Owned, except SECTION_STATUS which is Codex-Owned)`

```md
1. SECTION_NAME: Hero
   TARGET_NODE_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=1-1000&m=dev
   NOTES: Hero phrases will have animation will reveal from right to left fade in cascaing delay of 1 second starting from the top. The know more button that when clicked scrolls to designated path. Know more button is fixed on the bottom part of the section. It floats and disappears when going to another section. It will return on the Blog Posts section as the back to top button. Important: A. Disregard the 'menu' node as this is already the header component.
   STATUS: awaiting-decision

2. SECTION_NAME: About Us
   TARGET_NODE_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=139-1298&m=dev
   NOTES: Reusable CTA will be used sitewid. Blocks numbers will animate count up from 0 to the designated number.
   STATUS: awaiting-decision

3. SECTION_NAME: Sectors
   TARGET_NODE_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=139-1466&m=dev
   NOTES: Create a reusable react component for that orange button with arrow as it will be used sitewide.
   STATUS: awaiting-decision

4. SECTION_NAME: Companies
   TARGET_NODE_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=139-1470&m=dev
   NOTES: Use reusable component for the each item in the array.
   STATUS: awaiting-decision

5. SECTION_NAME: Blog posts
   TARGET_NODE_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=147-2382&m=dev
   NOTES: This is a grid of blog posts. That back to top component is the same know more button from hero. You will use the reusable button with arrow from Sectors section.
   STATUS: ready

   Important: Create first schema type for Posts before doing this section. Schema of each post should be image, title, date published, SEO, and a page builder so post content can be dynamic.
```

## Shared Notes `(Developer-Owned)`

```md
PAGE_NOTES: Respect Agents rules on schema and contents must be inside an array field of the section.
GLOBAL_NOTES:
```

## Agent 1

### Inputs `(Developer-Owned)`

```md
PAGES_IN_SCOPE: homepage
SCHEMA_TARGETS:
MIGRATION_TARGETS:
EXISTING_SCHEMA_FOLLOW_UP: none
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
STATUS: done
CORRECTION_ROUND: 1
LAST_ACTION: approve
NEXT_ACTION: agent-4-start
HANDOFF_READY: yes
NEXT_AGENT: Agent 4
```

### Decision `(Developer-Owned)`

```md
DECISION: approve
DECIDED_BY:
DECISION_DATE:
NOTES: Make the necessary correction in both schema if needed and in the seeding script.

CORRECTION_ITEMS:
SECTIONS
Home Hero Section - The background can either be image or video
Home About Section - Image should be inside the contents array as that is not a background image. It is inside a column inside top. Stats also should be inside contents array inside a row named bottom.
Home Sections Section - should consist of 2 rows, 1st row has the text and 2nd row has 2 columns, each column has an image.
Home Companies Section - Items must be inside contents, it should be inside a row

SEED SCRIPT
It should not create a new document and update only the existing english homepage document.
```

### Outputs `(Codex-Owned)`

```md
SCHEMA_FILES_UPDATED:

- studio/src/schemaTypes/index.ts
- studio/src/schemaTypes/objects/pageBuilderBlockTypes.ts
- studio/src/schemaTypes/objects/homeHeroSection.ts
- studio/src/schemaTypes/objects/homeAboutSection.ts
- studio/src/schemaTypes/objects/homeSectorsSection.ts
- studio/src/schemaTypes/objects/homeCompaniesSection.ts
- studio/src/schemaTypes/objects/homeAboutImageBlock.ts
- studio/src/schemaTypes/objects/homeAboutStatsBlock.ts
- studio/src/schemaTypes/objects/homeCompanyItemsBlock.ts
- studio/src/schemaTypes/objects/homeSectorListBlock.ts
- studio/src/schemaTypes/objects/homeSectorListItem.ts
- sanity.schema.json

QUERY_FILES_UPDATED:

- frontend/sanity/lib/queries.ts

TYPE_FILES_UPDATED:

- frontend/sanity/lib/types.ts

MIGRATIONS_CREATED:

- AI-docs/jobs/\_shared/migrations/2026-03-27-homepage-seed.mjs

VERIFICATION:

- `npm.cmd run type-check --workspace=studio` -> passed
- `npm.cmd run type-check --workspace=frontend` -> passed
- `node --check AI-docs/jobs/_shared/migrations/2026-03-27-homepage-seed.mjs` -> passed
- `$env:XDG_CONFIG_HOME='C:\Users\NAZARE~1\AppData\Local\Temp\codex-sanity-config'; $env:SANITY_DISABLE_UPDATE_CHECK='1'; $env:NO_UPDATE_NOTIFIER='1'; npm.cmd exec --workspace=studio -- sanity schema extract --enforce-required-fields --path ../sanity.schema.json` -> passed
- `node AI-docs/jobs/_shared/migrations/2026-03-27-homepage-seed.mjs` -> passed

NOTES:

- Home hero now uses `backgroundMedia` (`cbMedia`) so the section can accept either an image or a video background.
- Home about now keeps the non-background image inside the top `contents[]` row via `homeAboutImageBlock`, and the stat cards moved into the bottom `contents[]` row via `homeAboutStatsBlock`.
- Home sectors now models the Figma layout as two `contents[]` rows: the heading row, then a split content row with `homeSectorListBlock` on the left and a featured `homeSectorItem` on the right.
- Home companies now keeps the company features inside `contents[]` through `homeCompanyItemsBlock`; only the background image stays on the section object.
- The homepage patch script now requires an existing `homePage-en` document, preserves existing curated post references, and patches only `pageBuilder` instead of creating new documents.

SEEDING_RESULTS:

- Patched homepage document: `homePage-en`
- Preserved curated post references: `post-agmc-motor-city`, `post-agmc-pitstop360`, `post-gulf-international-levant`, `post-mpc-johnson-and-johnson`
- Executed command: `node AI-docs/jobs/_shared/migrations/2026-03-27-homepage-seed.mjs`
- Result: passed
```

### Handoff `(Codex-Owned)`

```md
HANDOFF_SUMMARY: Agent 1 is approved and closed. The homepage schema/query/manual-type contract reflects the corrected nested `contents[]` structure for hero, about, sectors, and companies; hero supports image or video background media; and the existing English homepage document was patched in place without creating new documents while preserving curated post references. Agent 2 can start token and typography work against `homeHeroSection`, `homeAboutSection`, `homeSectorsSection`, `homeCompaniesSection`, and `homeBlogPostsSection` as the canonical homepage blocks.
```

## Agent 4

### Inputs `(Developer-Owned)`

```md
ACTIVE_SECTION: Companies Section
TARGET_NODE_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=139-1470&m=dev
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
STATUS: awaiting-decision
CORRECTION_ROUND: 1
LAST_ACTION: start
NEXT_ACTION: developer-review
HANDOFF_READY: no
NEXT_AGENT: none
```

### Decision `(Developer-Owned)`

```md
DECISION: in-progress
DECIDED_BY:
DECISION_DATE:
NOTES:
CORRECTION_ITEMS:
```

### Outputs `(Codex-Owned)`

```md
PAGES_UPDATED:

- frontend/app/components/BuilderPageLayout.tsx

SECTIONS_UPDATED:

- Hero
- About Us
- Sectors
- Companies

SCHEMA_FILES_UPDATED:

- studio/src/schemaTypes/objects/homeSectorListBlock.ts

DATA_CONTRACT_CHANGES:

- frontend/sanity/lib/queries.ts
- frontend/sanity/lib/types.ts

RENDERER_CHANGES:

- frontend/app/components/BlockRenderer.tsx
- frontend/app/components/home/CompanyFeatureLink.tsx
- frontend/app/components/home/HeroPhraseBadge.tsx
- frontend/app/components/home/FloatingSectionAction.tsx
- frontend/app/components/home/CountUpText.tsx
- frontend/app/components/home/SectionArrowCta.tsx
- frontend/app/components/home/SectionArrowIconButton.tsx

SEEDING_CHANGES:

- none

RESPONSIVE_DECISIONS:

- The hero now fills the viewport, stacks headline and supporting copy on small screens, and keeps the split Figma composition from `lg` upward.
- Floating phrases are hidden below `lg` to avoid overlap on smaller screens while preserving the desktop composition.
- The floating CTA remains fixed to the lower-right viewport edge and only stays visible while the hero section is intersecting.
- The about section keeps the image/content split from `lg` upward, but stacks the image above the copy and CTA on smaller screens.
- The stat cards collapse to a simple mobile grid and switch to the staggered three-column composition on large screens.
- The sectors section keeps the CMS row order intact, but visually promotes the featured image card above the blurred sector list on small screens and restores the Figma side-by-side layout from `lg` upward.
- The sector-list typography steps down in size and blur based on distance from the highlighted item so the highlighted sector remains dominant while the stack still reads cleanly on mobile and desktop.
- The companies section keeps the centered intro copy above the feature list on all breakpoints, while the company items collapse from a single six-column desktop row to a two-column mobile grid without flattening the CMS row structure.

TOKEN_USAGE_SUMMARY:

- Reused the existing header negative variant, `max-w-wide`, `bg-albatha-midnight`, and the current white/black opacity utilities instead of introducing new design tokens.
- Reused `bg-albatha-midnight`, `bg-albatha-blue`, `text-albatha-blue`, `bg-background`, and the existing spacing scale for the About section and stat cards.
- Reused `bg-background`, `bg-albatha-midnight`, `bg-albatha-orange`, `text-albatha-blue`, and the existing spacing utilities for the sectors fade mask, featured card, and reusable arrow button instead of introducing new tokens.
- Reused `max-w-wide`, `bg-albatha-midnight`, `text-albatha-blue`, and the existing white opacity utilities for the companies background treatment and reusable company-feature links instead of creating new homepage-specific tokens.

ARBITRARY_VALUE_JUSTIFICATIONS:

- `rounded-r-[1.875rem]` preserves the Figma image corner treatment on the About image without introducing a new token during Agent 4 work.
- `min-h-[4.8125rem]`, `w-[4.8125rem]`, and `tracking-[0.18em]` on the reusable split CTA preserve the Figma button proportions that will be reused in later sections.
- `lg:[&_h2]:text-[2.5rem]`, `rounded-[1.75rem]`, `min-h-[22rem]`, `min-h-[26rem]`, `min-h-[36rem]`, `max-w-[12rem]`, and `tracking-[0.24em]` keep the sectors heading and featured-card proportions close to the Figma composition without expanding Agent 4 into token work.
- `lg:[&_p]:text-[2.1875rem]`, `lg:[&_p]:leading-[1.2857142857]`, `lg:text-[1.75rem]`, and `lg:space-y-[3.75rem]` keep the companies intro copy, item titles, and section spacing aligned to the Figma proportions without turning this pass into token work.

DRAG_AND_DROP_NOTES:

- The hero section, `phrases[]`, top-level `contents[]` rows, and nested `columns[]` all render keyed `data-sanity` paths so Presentation drag-and-drop can target the Agent 1 schema shape directly.
- The hero still renders the CMS-managed `contents[] -> columns[] -> contents[]` structure through the existing page-builder recursion rather than flattening the section into hardcoded JSX content.
- The About section keeps the Agent 1 structure intact: top-level `contents[]` rows, row `columns[]`, and nested `homeAboutImageBlock`, `cbParagraph`, `cbHeading`, `cbButton`, and `homeAboutStatsBlock` items all resolve keyed `data-sanity` paths.
- The reusable CTA intercepts the seeded `cbButton` only inside the About section render path; the underlying Sanity content shape remains unchanged for Visual Editing.
- The sectors section keeps the Agent 1 structure intact: the section reads `contents[]` row 1 for the heading and row 2 for the split layout, while `homeSectorListBlock.items[]` and the featured `homeSectorItem` each resolve keyed `data-sanity` paths for Visual Editing.
- The companies section keeps the Agent 1 structure intact: the section reads row 1 for the centered paragraph and row 2 for the `homeCompanyItemsBlock`, and each `items[]` entry resolves its own keyed `data-sanity` path through the reusable company-feature component.

OPEN_DECISIONS:

- The companies section now renders the corrected Agent 1 schema shape; no additional schema, query, or manual-type changes were required for this start pass.
- Workspace-wide `npm run lint --workspace=frontend` still fails on pre-existing issues outside the Agent 4 scope in `frontend/app/[...segments]/page.tsx`, `frontend/app/components/Header.tsx`, and `frontend/app/lib/resolve-page-metadata.ts`. The existing `@next/next/no-img-element` warnings in `frontend/app/components/atoms/image/index.tsx`, `frontend/app/components/atoms/site-logo/index.tsx`, and `frontend/app/components/organisms/cover/index.tsx` also remain unchanged.
```

### Handoff `(Codex-Owned)`

```md
HANDOFF_SUMMARY: Agent 4 `start` has now implemented the homepage hero, about, sectors, and companies renderers, added reusable homepage helpers for the floating CTA, split CTA button, corner arrow button, company feature link, phrase reveal, and stat count-up behavior, and updated the homepage builder layout so the negative header overlays the hero instead of rendering above a generic page title shell.
REQUIRED_NEXT_STEPS:

- Developer should review the hero, about, sectors, and companies sections against desktop/mobile expectations and confirm the fixed CTA target path, About image crop, stat-card composition, sectors list blur hierarchy, featured-card crop, the reusable orange arrow-button treatment, and the companies background overlay plus item wrapping behavior.
- If approved, prompt `Agent 4 do /jobs/homepage/tasks.md approve`. If changes are needed, record them in `Review` and prompt `Agent 4 do /jobs/homepage/tasks.md correction`.

CONSTRAINTS_FOR_NEXT_AGENT:

- Keep homepage sections rendering through the page builder; do not move homepage content assembly into `frontend/app/page.tsx`.
- Reuse `FloatingSectionAction` for the blog-posts back-to-top behavior instead of creating a second floating CTA implementation.
- Preserve the keyed `data-sanity` paths on `phrases[]`, `contents[]`, and `columns[]` for Visual Editing.
- Reuse `SectionArrowCta` for later homepage CTAs where the Figma split dark/orange button appears instead of restyling individual `cbButton` blocks ad hoc.
- Reuse `SectionArrowIconButton` for later homepage cards where the standalone orange arrow button appears instead of recreating another corner CTA.
- Reuse `CompanyFeatureLink` for later homepage company or brand link rows instead of recreating item markup inside section renderers.
- Reuse `CountUpText` for additional numeric stat cards rather than duplicating count-up logic.
- Preserve the `homeSectorListBlock.items[]` plus featured `homeSectorItem` schema shape when extending the homepage sectors or blog card patterns.
```

## Execution Log `(Codex-Owned)`

```md
- YYYY-MM-DD: Task file created.
- 2026-03-27: Agent 1 `start` completed. Added homepage section schemas, added `post` document schema, updated homepage query/manual types, regenerated `sanity.schema.json`, and verified Studio/frontend type-checks.
- 2026-03-27: Agent 1 `approve` completed. Scope closed at `STATUS: done`, `HANDOFF_READY: yes`, `NEXT_AGENT: Agent 2`.
- 2026-03-27: Agent 1 `seed` completed. Added AI-docs/jobs/\_shared/migrations/2026-03-27-homepage-seed.mjs and ran `node AI-docs/jobs/_shared/migrations/2026-03-27-homepage-seed.mjs`, which seeded `homePage-en` and four `post` documents using Figma-derived copy and uploaded image assets.
- 2026-03-27: Agent 1 `correction` completed. Updated the homepage section schema contract to move the requested nested content into `contents[]`, added wrapper object types for the corrected about/sectors/companies layouts, regenerated `sanity.schema.json`, and ran `node AI-docs/jobs/_shared/migrations/2026-03-27-homepage-seed.mjs` to patch the existing `homePage-en` document in place while preserving curated post references.
- 2026-03-27: Agent 1 `approve` completed after correction round 1. Scope closed at `STATUS: done`, `HANDOFF_READY: yes`, `NEXT_AGENT: Agent 2`.
- 2026-03-27: Agent 4 `start` completed for Hero. Added the `homeHeroSection` renderer plus reusable floating CTA and phrase-reveal helpers, updated the homepage builder layout so the negative header overlays the hero, ran `npm.cmd run type-check --workspace=frontend` successfully, confirmed the changed files pass targeted ESLint, and noted that workspace-wide frontend lint still has pre-existing failures outside the hero scope.
- 2026-03-27: Agent 4 `start` continued for About Us after the developer updated `ACTIVE_SECTION`. Added the `homeAboutSection`, `homeAboutImageBlock`, and `homeAboutStatsBlock` render paths, added reusable split CTA and count-up helpers, ran `npm.cmd run type-check --workspace=frontend` successfully, and confirmed the changed files pass targeted ESLint.
- 2026-03-27: Agent 4 `start` continued for Sectors after the developer updated `ACTIVE_SECTION`. Added the `homeSectorsSection`, `homeSectorListBlock`, and `homeSectorItem` render paths, created the reusable `SectionArrowIconButton` helper for the standalone orange arrow CTA, ran `npm.cmd run type-check --workspace=frontend` successfully, confirmed the changed files pass targeted ESLint, and verified that workspace-wide frontend lint still fails only on pre-existing issues outside the Agent 4 scope.
- 2026-03-27: Agent 4 `correction` updated the Sectors data contract only as requested. `homeSectorListBlock` now requires its own image so the bottom row schema can represent two image-backed columns, and the frontend query/manual types were synced to the new field; `npm.cmd run type-check --workspace=studio`, `npm.cmd run type-check --workspace=frontend`, and targeted ESLint for `frontend/sanity/lib/queries.ts` plus `frontend/sanity/lib/types.ts` all passed.
- 2026-03-27: Agent 4 `start` continued for Companies after the developer set `ACTIVE_SECTION` to the companies scope. Added the `homeCompaniesSection` and `homeCompanyItemsBlock` render paths, created the reusable `CompanyFeatureLink` helper for company rows, ran `npm.cmd run type-check --workspace=frontend` successfully, confirmed `frontend/app/components/BlockRenderer.tsx` plus `frontend/app/components/home/CompanyFeatureLink.tsx` pass targeted ESLint, and verified that workspace-wide frontend lint still fails only on pre-existing issues outside the Agent 4 scope.
```
