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
PROJECT_NAME: Footer
PAGE_NAME: N/A
PAGE_SLUG: N/A
NEXT_ROUTE: N/A
SANITY_PAGE_TYPE: singleton
PROJECT_FIGMA_URL: https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=342-2252&m=dev
DESIGN_SYSTEM_NODE_URL:
Negative
https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=342-2253&m=dev
Positive
https://www.figma.com/design/SHmyeVzNQcnZ5cf20V3uIh/Albatha-Website?node-id=342-2288&m=dev
TARGET_PAGE_NODE_URL:
LOCALE_SCOPE:
```

## Shared Notes `(Developer-Owned)`

```md
PAGE_NOTES: 
GLOBAL_NOTES: Has 2 types, positive and negative. Each page will have a settings or field where positive or negative will be selected. Reference how we did in header schema document and react component. Leave the company details in sitesettings; addresses, contact email, contact number. Make sure the links also follows current language config.
```

## Agent 1

### Inputs `(Developer-Owned)`

```md
PAGES_IN_SCOPE:
SCHEMA_TARGETS:
MIGRATION_TARGETS:
EXISTING_SCHEMA_FOLLOW_UP: none
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
CORRECTION_ROUND: 0
LAST_ACTION: approve
NEXT_ACTION: Agent 3 start
HANDOFF_READY: yes
NEXT_AGENT: Agent 3
```

### Decision `(Developer-Owned)`

```md
DECISION: approved
DECIDED_BY:
DECISION_DATE:
NOTES:
CORRECTION_ITEMS:
```

### Outputs `(Codex-Owned)`

```md
SCHEMA_FILES_UPDATED: studio/src/schemaTypes/objects/pageFooterAppearance.ts; studio/src/schemaTypes/objects/footerSettings.ts; studio/src/schemaTypes/singletons/settings.tsx; studio/src/schemaTypes/documents/page.ts; studio/src/schemaTypes/documents/legalPage.ts; studio/src/schemaTypes/singletons/homePage.ts; studio/src/schemaTypes/index.ts; sanity.schema.json; studio/sanity.types.ts; frontend/sanity.types.ts
QUERY_CHANGES: frontend/sanity/lib/queries.ts now resolves footer creditLink plus grouped footer navigationGroups in layoutQuery and includes footerAppearance in page, homepage, and legal page queries.
TYPE_CHANGES: frontend/sanity/lib/types.ts now exports FooterVariant and PageFooterAppearance and adds footerAppearance to PageDocumentForBuilder.
MIGRATION_CHANGES: AI-docs/jobs/_shared/migrations/2026-03-25-footer-appearance-defaults.mjs backfills footerAppearance.variant = "positive" for existing homePage, page, and legalPage documents, seeds the siteFooter singleton with grouped navigation/legal defaults from Figma, and seeds siteSettings with footer company/contact details when missing.
FOLLOW_UP_COMMANDS_RUN: npm.cmd run sanity:typegen --workspace=studio; npm.cmd run sanity:typegen --workspace=frontend; npm.cmd run type-check --workspace=studio; npm.cmd run type-check --workspace=frontend; PowerShell env-loader from root .env.local plus node AI-docs/jobs/_shared/migrations/2026-03-25-footer-appearance-defaults.mjs
FOLLOW_UP_RESULTS: Studio and frontend type-checks passed. Sanity schema extraction regenerated sanity.schema.json plus studio/frontend generated types. Frontend sanity typegen still reported the existing query-extraction warning for the recursive createPageBuilderBlockProjection helper in frontend/sanity/lib/queries.ts, but it completed and regenerated query types successfully. The footer migration command backfilled footerAppearance.variant = "positive" on 1 existing homePage document, seeded the siteFooter singleton with the grouped Figma footer defaults, and seeded siteSettings with the missing footer company/contact details.
SECTION_SHAPE_DECISIONS: Page-like documents now own footerAppearance.variant for positive/negative footer selection. The footer singleton now owns positiveLogo and negativeLogo plus grouped navigationGroups, legalMenu, copyright lead-in text, and optional linked footer credit. Company name, office locations, contact phone, and contact email now live in siteSettings instead of the footer singleton.
OPEN_DECISIONS: positiveLogo and negativeLogo assets still need to be populated in Sanity. Agent 3 should treat navigationGroups as the canonical footer navigation shape and can retire the legacy heading/menu fields only after the shared footer renderer is migrated.
```

### Handoff `(Codex-Owned)`

```md
HANDOFF_SUMMARY: The footer schema contract now mirrors the Figma light/dark footer variants with page-level footerAppearance selection, grouped multi-column navigation, a linked footer credit, and company/contact details sourced from siteSettings. The starter migration has already been run against Sanity, so existing footer content now has the required baseline data.
REQUIRED_NEXT_STEPS: Agent 3 should rebuild the shared Footer to read the current page document's footerAppearance.variant, switch logos and theme styling between positive/negative variants, render footer.navigationGroups plus legalMenu, and source companyName/officeLocations/contactPhone/contactEmail from siteSettings while preserving locale-aware links.
CONSTRAINTS_FOR_NEXT_AGENT: Keep footerAppearance.variant page-scoped and default to positive when documents are missing data. Keep company/contact details on siteSettings, not the footer singleton. Prefer navigationGroups over the legacy flat menu field, and preserve the locale-aware href behavior already used by shared header/footer navigation.
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
BLOCKERS: Agent 1
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
STATUS: awaiting-decision
CORRECTION_ROUND: 2
LAST_ACTION: correction
NEXT_ACTION: developer-review
HANDOFF_READY: no
NEXT_AGENT: Agent 4
```

### Decision `(Developer-Owned)`

```md
DECISION: changes-requested 
DECIDED_BY:
DECISION_DATE:
NOTES: Make the styling 100% same as in figma. The structure is good already just need to have some adjustments. Focus on the right columns 
Albatha Links and Business Units, currently your structure is 2 column but these are 3 columns in the figma. Focus on that adjustment. Colors, spacing, fonts are all good now. Just break the last column in to 2 so we have 3 columns. the last column dont have the title nav
CORRECTION_ITEMS:
```

### Outputs `(Codex-Owned)`

```md
SCHEMA_FILES_UPDATED: none
SHARED_COMPONENTS_UPDATED: frontend/app/components/Footer.tsx; frontend/app/page.tsx; frontend/app/[...segments]/page.tsx; frontend/app/layout.tsx; frontend/app/lib/page-types.ts; frontend/sanity/lib/settings-types.ts
RENDERER_CHANGES: Footer remains route-rendered so page.footerAppearance.variant can switch positive/negative footer styling per document. The shared Footer styling was corrected against the Figma footer nodes in the shared task input (negative 342:2253, positive 342:2288): removed the extra card, pill, border, and texture treatments from the initial pass; tightened the layout to the 1600px footer frame geometry; matched the flatter typography hierarchy, divider treatment, legal links, and credit row; and now flattens grouped footer navigation into three top-level right-side columns so the final untitled Businesses Units column renders as its own column instead of nesting under the titled column.
OPEN_DECISIONS: positiveLogo and negativeLogo still need to be populated in Sanity for the final branded footer variants.
```

### Handoff `(Codex-Owned)`

```md
HANDOFF_SUMMARY: The shared frontend footer now follows the Agent 1 schema contract and has been visually corrected against the Figma light and dark footer variants. Footer rendering remains in the page routes so each page can pass footerAppearance.variant, and the shared Footer component now matches the flatter Figma structure for grouped navigation, legal links, divider spacing, contact rows, and the footer credit while still sourcing content from the CMS.
REQUIRED_NEXT_STEPS: Developer should review the shared footer against the intended Figma footer design and confirm the content in Sanity, especially positiveLogo and negativeLogo. After approval, Agent 4 can reuse the shared footer without adding page-specific footer logic.
CONSTRAINTS_FOR_NEXT_AGENT: Keep footerAppearance.variant page-scoped and pass it from route-level page documents into the shared Footer. Keep company/contact content on siteSettings and navigation groups on the footer singleton. Preserve locale-aware href handling and the legacy menu fallback until the old footer fields are intentionally retired.
```

## Execution Log `(Codex-Owned)`

```md
- YYYY-MM-DD: Task file created.
- 2026-03-25: Agent 1 start completed. Added page-level footerAppearance schema, footer positive/negative logo fields, grouped footer navigation, footer credit fields, and siteSettings-owned company/contact fields; synchronized page/layout queries and shared page types; regenerated sanity schema/types; and verified both studio and frontend with tsc --noEmit.
- 2026-03-25: Ran AI-docs/jobs/_shared/migrations/2026-03-25-footer-appearance-defaults.mjs using root .env.local values with SANITY_PROJECT_ID/SANITY_DATASET aliases mapped from the repo env. Result: backfilled footerAppearance.variant on 1 homePage document, seeded siteFooter grouped footer defaults, and seeded siteSettings footer company/contact details.
- 2026-03-25: Agent 1 approval completed. Footer schema scope is done and ready for Agent 3.
- 2026-03-25: Agent 3 start completed. Rebuilt the shared frontend footer to consume footer navigationGroups, legalMenu, creditLink, footer logos, and siteSettings company/contact fields; moved footer rendering from frontend/app/layout.tsx into page routes so page.footerAppearance.variant controls the footer theme per page; updated shared layout/page typings; and verified with npm.cmd run type-check --workspace=frontend.
- 2026-03-25: Agent 3 correction completed. Compared the footer against Figma nodes 342:2253 and 342:2288, removed non-Figma styling from the initial pass, tightened spacing and typography to the footer frame, and verified again with npm.cmd run type-check --workspace=frontend.
- 2026-03-25: Agent 3 correction completed. Adjusted the right-side footer navigation rendering so grouped navigation columns are flattened into three top-level columns, with the last column intentionally untitled to match Figma, and verified again with npm.cmd run type-check --workspace=frontend.
```
