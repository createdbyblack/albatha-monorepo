# Page Task Template


Developers and Codex both update this file. Follow the ownership labels in each section.

## Ownership Rules

- `Developer-Owned`: developers may edit these sections directly
- `Codex-Owned`: developers should not edit these sections during normal workflow runs
- `Allowed Edit Paths`: developer-owned when constraining scope for a run
- `Execution Log`: Codex-owned unless a workflow doc explicitly requires a manual note
- `SECTION_STATUS`: Codex-owned even though the section list itself is developer-owned

## Shared Inputs `(Developer-Owned)`

```md
PROJECT_NAME: Site Header
PAGE_NAME: N/A
PAGE_SLUG: N/A
NEXT_ROUTE: N/A
SANITY_PAGE_TYPE: singleton
PROJECT_FIGMA_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=1-2&p=f&m=dev
DESIGN_SYSTEM_NODE_URL: 
Negative version
https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=332-3573&m=dev
Closed
https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=332-3574&m=dev
Open megamenu
https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=332-3580&m=dev

Positive version
https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=332-4792&m=dev
Clsoed
https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=332-4793&m=dev
Open megamenu
https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=332-4799&m=dev

TARGET_PAGE_NODE_URL:N/A
LOCALE_SCOPE:
```

## Shared Notes `(Developer-Owned)`

```md
PAGE_NOTES: Has 2 types, positive and negative. Each page will have a settings or field where positive or negative will be selected.  It will also have positive and negative logos that will render based on page settings. 
GLOBAL_NOTES:
```

## Agent 1

### Inputs `(Developer-Owned)`

```md
PAGES_IN_SCOPE: Sitewide
SCHEMA_TARGETS: Header
MIGRATION_TARGETS:
REUSE_PRIORITY:
NOTES:
```

### Dependencies `(Developer-Owned)`

```md
BLOCKERS: N/A
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
NEXT_ACTION: Agent 3 start
HANDOFF_READY: yes
NEXT_AGENT: Agent 3
```

### Review `(Developer-Owned)`

```md
REVIEW_DECISION: approved
REVIEWED_BY: 
REVIEW_DATE:
REVIEW_NOTES: Run the migration script using values from .env.local file
CORRECTION_ITEMS:
```

### Outputs `(Codex-Owned)`

```md
SCHEMA_FILES_UPDATED: studio/src/schemaTypes/objects/headerSettings.ts; studio/src/schemaTypes/objects/menuLink.ts; studio/src/schemaTypes/objects/menuMegaMenu.ts; studio/src/schemaTypes/objects/menuMegaMenuGroup.ts; studio/src/schemaTypes/objects/menuMegaMenuColumn.ts; studio/src/schemaTypes/objects/pageHeaderAppearance.ts; studio/src/schemaTypes/documents/page.ts; studio/src/schemaTypes/documents/legalPage.ts; studio/src/schemaTypes/singletons/homePage.ts; studio/src/schemaTypes/index.ts
QUERY_CHANGES: frontend/sanity/lib/queries.ts now resolves mega menu link trees in header/footer menu projections and includes headerAppearance in page, homepage, and legal page queries.
TYPE_CHANGES: frontend/sanity/lib/types.ts now exports HeaderVariant and PageHeaderAppearance and adds headerAppearance to PageDocumentForBuilder.
MIGRATION_CHANGES: AI-docs/jobs/_shared/migrations/2026-03-25-header-appearance-defaults.mjs backfills headerAppearance.variant = "positive" for existing homePage, page, and legalPage documents that do not yet have the new field.
SECTION_SHAPE_DECISIONS: Header singleton now owns positiveLogo and negativeLogo assets; page-like documents now own headerAppearance.variant for positive/negative selection; menuLink may use either subLinks[] for simple dropdowns or megaMenu.groups[].columns[].links[] for grouped megamenu content.
OPEN_DECISIONS: none
```

### Handoff `(Codex-Owned)`

```md
HANDOFF_SUMMARY: The schema contract for the site header now supports positive/negative page-level variants, dedicated positive/negative header logos, and grouped multi-column megamenu content on header menu items.
REQUIRED_NEXT_STEPS: Run AI-docs/jobs/_shared/migrations/2026-03-25-header-appearance-defaults.mjs before or alongside content rollout so existing page-like documents default to the positive header variant. After that, Agent 3 should wire Header rendering to select the correct header logo from the header singleton based on the current page document's headerAppearance.variant and render megaMenu groups and columns for applicable menu items.
CONSTRAINTS_FOR_NEXT_AGENT: Treat headerAppearance.variant as page-scoped and default to positive when existing documents have no value yet; prefer menuLink.megaMenu for grouped dropdowns and subLinks for simple dropdowns; do not reshape the schema contract without review because page, homepage, and legal page queries already depend on it; the migration only backfills page-like documents and does not populate positiveLogo or negativeLogo assets in the header singleton.
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
BLOCKERS: N/A
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
STATUS: done
CORRECTION_ROUND: 7
LAST_ACTION: approve
NEXT_ACTION: none
HANDOFF_READY: yes
NEXT_AGENT: none
```

### Review `(Developer-Owned)`

```md
REVIEW_DECISION: approved
REVIEWED_BY:
REVIEW_DATE:
REVIEW_NOTES: 
CORRECTION_ITEMS:
```

### Outputs `(Codex-Owned)`

```md
SCHEMA_FILES_UPDATED:
SHARED_COMPONENTS_UPDATED: frontend/app/layout.tsx; frontend/app/page.tsx; frontend/app/[...segments]/page.tsx; frontend/app/components/PageBuilder.tsx; frontend/app/lib/page-types.ts; frontend/app/components/Header.tsx; frontend/app/components/Footer.tsx; frontend/app/globals.css; frontend/app/lib/locale-path.ts; frontend/sanity/lib/utils.ts
RENDERER_CHANGES: Header rendering is now route-driven instead of context-driven. Each route renders the shared Header with the current page document's headerAppearance.variant as a prop, the root layout no longer renders the header globally, and the obsolete HeaderAppearanceProvider sync path was removed. A direct Sanity query confirmed the homepage document currently returns headerAppearance.variant = "negative". The header language CTA now resolves the current pathname and links between the default English route and the Arabic /ae route for the same page, and the header/footer menu links reuse a new `localizeHref` helper plus `frontend/app/lib/locale-path.ts` to keep `/ae` prefixes when navigating inside the Arabic locale.
OPEN_DECISIONS: positiveLogo and negativeLogo assets still need to be populated in Sanity if variant-specific logos should render as images instead of the generic site logo fallback.
```

### Handoff `(Codex-Owned)`

```md
HANDOFF_SUMMARY: The shared header now uses route-driven header variants, a real locale-switch CTA, and shared locale helpers so both header and footer navigation preserve `/ae` when the Arabic locale is active. It is rendered directly by each route with the page document's headerAppearance.variant.
REQUIRED_NEXT_STEPS: Review the homepage, legal pages, and standard content pages in the browser to confirm both headerAppearance variants and all shared navigation links (header menus, footer links, language CTA) keep the current locale path and resolve to `/ae/...` when expected. If approved, Agent 4 can treat the shared header contract as stable and stay out of shared header files.
CONSTRAINTS_FOR_NEXT_AGENT: Header appearance still falls back to positive when a page document has no headerAppearance variant. Keep Agent 4 out of shared header/layout files unless review requests coordinated changes.
```


## Execution Log `(Codex-Owned)`

```md
- YYYY-MM-DD: Task file created.
- 2026-03-25: Agent 1 start completed. Added header logo variant fields, page-level header appearance schema, grouped megamenu schema objects, and synchronized header/page queries and frontend builder types.
- 2026-03-25: Agent 1 review applied. Added a shared migration script to backfill headerAppearance.variant = "positive" on existing homePage, page, and legalPage documents.
- 2026-03-25: Agent 1 approval finalized. Scope closed at done and handed off to Agent 3.
- 2026-03-25: Ran AI-docs/jobs/_shared/migrations/2026-03-25-header-appearance-defaults.mjs using root .env.local values. Result: no documents required headerAppearance backfill.
- 2026-03-25: Corrected the shared migration script to seed the siteHeader singleton from Figma menu values, reran it with root .env.local values, and verified primary/secondary menus plus the Business Units megamenu were created in Sanity.
- 2026-03-25: Agent 3 start completed. Added a shared header appearance provider, rebuilt the site header for positive/negative variants plus mega menu rendering, synchronized page-level header variants from PageBuilder, and verified the workspace with npm.cmd run type-check.
- 2026-03-25: Agent 3 correction completed. Rebuilt the shared header structure to match the Figma positive/negative desktop states more closely, refreshed the megamenu treatment and mobile navigation styling, and verified the frontend workspace with npm.cmd run type-check.
- 2026-03-25: Agent 3 correction completed. Replaced hardcoded header color utilities with semantic header theme tokens in frontend/app/globals.css, updated frontend/app/components/Header.tsx to consume those tokens, and verified the frontend workspace with npm.cmd run type-check.
- 2026-03-25: Agent 3 correction completed. Moved header appearance synchronization to the route layer for home, standard, and legal pages, removed the PageBuilder-owned header sync, updated page typing for legal pages, and verified the frontend workspace with npm.cmd run type-check.
- 2026-03-25: Agent 3 correction completed. Removed the provider's pathname-driven reset to positive so route-level headerAppearance values from page documents are no longer overwritten during navigation, and verified the frontend workspace with npm.cmd run type-check.
- 2026-03-25: Agent 3 correction completed. Queried Sanity directly and confirmed the homepage document returns headerAppearance.variant = "negative", then removed the client-side header appearance context architecture and switched to route-driven shared Header rendering with the page document variant passed as a prop. Verified the frontend workspace with npm.cmd run type-check.
- 2026-03-25: Agent 3 correction completed. Replaced the header language CTA's visual-only button with a real locale switch link that flips between English routes and matching /ae routes for the current pathname, and verified the frontend workspace with npm.cmd run type-check.
- 2026-03-25: Agent 3 correction completed. Added a reusable locale-path helper and localized header/footer navigation links through `localizeHref` so Arabic navigation keeps `/ae`, and verified the frontend workspace with npm.cmd run type-check.
- 2026-03-25: Agent 3 approval completed. Locale-aware header/footer navigation and the language CTA are stable, and `npm.cmd run type-check --workspace=frontend` passed.
```
