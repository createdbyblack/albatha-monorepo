# Albatha Website Monorepo

This repository contains the Albatha website platform as a single monorepo. It combines the public-facing Next.js application, the Sanity Studio used to manage content, and the internal workflow documentation used to build and maintain the site.

## Overview

- `frontend/`: Next.js 16 application for the Albatha website
- `studio/`: Sanity Studio for content editing, schema management, and visual editing
- `ai-docs/`: repository workflow docs, job files, and agent rules
- `sanity.schema.json`: generated schema snapshot shared across the repo

The stack is centered around a CMS-driven website with live content updates, visual editing support, and a page-builder-style content model.

## Requirements

- Node.js LTS
- npm
- Access to the Albatha Sanity project and dataset
- Sanity API tokens for frontend and studio usage

## Getting Started

1. Install dependencies from the repository root:

```bash
npm install
```

2. Use the root environment example file as the source of truth:

```bash
cp .env.example frontend/.env.local
cp .env.example studio/.env.local
```

If you prefer, you can also use the workspace-specific example files:

```bash
cp frontend/.env.example frontend/.env.local
cp studio/.env.example studio/.env.local
```

3. Fill in the required Sanity values:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_READ_TOKEN`
- `SANITY_STUDIO_PROJECT_ID`
- `SANITY_STUDIO_DATASET`

4. Start both applications from the repo root:

```bash
npm run dev
```

Development URLs:

- Website: `http://localhost:3000`
- Sanity Studio: `http://localhost:3333`

## Root Scripts

- `npm run dev`: starts the frontend and studio workspaces in parallel
- `npm run lint`: runs frontend linting
- `npm run type-check`: runs type-checking across workspaces
- `npm run format`: formats the repository with Prettier

## Repository Structure

```txt
.
|-- ai-docs/               # Workflow references, job files, and implementation rules
|-- frontend/              # Next.js website
|   |-- app/               # App Router routes, layouts, and components
|   |-- public/            # Static assets
|   `-- sanity/            # Sanity client, queries, and live preview helpers
|-- studio/                # Sanity Studio
|   |-- src/               # Schemas, structure, plugins, and studio config
|   `-- scripts/           # Studio-side scripts
|-- .env.example           # Shared env example for both workspaces
|-- package.json           # Root workspace scripts
`-- sanity.schema.json     # Generated schema export
```

## Content Workflow

1. Content editors manage pages and shared content in Sanity Studio.
2. The Next.js frontend reads published and preview content through the Sanity client.
3. The website renders CMS-driven sections and supports visual editing where configured.
4. Repository workflow and implementation notes live in `ai-docs/`.

## Deployment Notes

- Deploy the website from the `frontend` workspace.
- Deploy the studio from the `studio` workspace if you are hosting it separately.
- Mirror the required environment variables in your deployment targets.

## References

- [Next.js documentation](https://nextjs.org/docs)
- [Sanity documentation](https://www.sanity.io/docs)
