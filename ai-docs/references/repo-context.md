# Repository Context

Use this file as the stable technical context for this repository.

## What This Repository Is

Monorepo starter for a Sanity CMS plus Next.js frontend stack:

- `studio`: Sanity Studio for content modeling, editing, and Visual Editing configuration
- `frontend`: Next.js 16 App Router website that consumes Sanity content
- root workspace scripts to run both together

## Core Architecture

### Monorepo layout

- `package.json`: npm workspaces and shared scripts
- `studio/`: schema, structure, plugins, and visual editing config
- `frontend/`: App Router site, Sanity queries, route handling, and renderers
- `sanity.schema.json`: extracted schema used by Sanity type generation

### Runtime flow

1. Editors create content in Sanity Studio.
2. Frontend fetches content through `frontend/sanity/lib/live.ts`.
3. Page content is rendered by components in `frontend/app/components`.
4. Draft Mode and Presentation Tool rely on `data-sanity` wiring for live preview and editing.

## Existing Stack

- Next.js 16
- React 19
- Tailwind CSS v4
- Sanity Studio
- next-sanity live API
- Presentation Tool and Draft Mode integration

## Important Scripts

From the repo root:

- `npm run dev`
- `npm run lint`
- `npm run type-check`
- `npm run import-sample-data`

## Environment

Copy `.env.example` values into:

- `frontend/.env.local`
- `studio/.env.local`

## Content Model Summary

Main documents:

- `homePage`
- `page`
- `legalPage`
- `settings`

Composable block families:

- atoms: `cbHeading`, `cbParagraph`, `cbWysiwyg`, `cbHtml`, `cbImage`, `cbButton`
- containers: `cbButtons`, `cbColumns`, `cbGroup`, `cbList`, `cbNavigation`, `cbCover`

## Routing And Rendering

Main routes:

- `frontend/app/page.tsx`
- `frontend/app/[...segments]/page.tsx`

Important implementation files:

- `frontend/sanity/lib/queries.ts`
- `frontend/sanity/lib/live.ts`
- `frontend/app/components/BlockRenderer.tsx`
- `frontend/app/layout.tsx`

## App Router Structure

Current repository structure relevant to this workflow:

```txt
frontend/
  app/
    layout.tsx
    globals.css
    page.tsx
    [...segments]/
      page.tsx
    components/
      atoms/
      molecules/
      organisms/
    lib/
  sanity/
    lib/
  public/
```

Repository conventions:

- use `frontend/app/**/page.tsx` for pages
- keep reusable UI under `frontend/app/components/**`
- prefer the existing `atoms`, `molecules`, `organisms`, and shared page-builder-aware component structure before adding new folders
- keep helper utilities in `frontend/app/lib/**` unless an existing repository pattern requires another location
- keep Sanity query and client code in `frontend/sanity/lib/**`
- keep assets local through `frontend/public/**` or imported local assets, never runtime Figma URLs

## Page Builder Structure

The repository's main nesting shape is:

- top-level sections in `pageBuilder[]`
- each section's dynamic body in `contents[]` with title `Contents`
- each `contents[]` item representing a row object
- each row object owning a `columns[]` array
- each column object owning nested `rows[]`, `columns[]`, or `contents[]` arrays as needed
- any extra section fields reserved for non-reorderable render configuration such as background media or section settings

Behavioral rules for this structure live in `AI-docs/references/workflow-reference.md`.

## High-Impact Files

- `studio/src/schemaTypes/index.ts`
- `studio/src/structure/index.ts`
- `frontend/sanity/lib/queries.ts`
- `frontend/app/[...segments]/page.tsx`
- `frontend/app/components/BlockRenderer.tsx`
- `frontend/app/layout.tsx`
