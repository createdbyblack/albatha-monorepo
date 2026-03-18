# Agent 2 Rules: Design Tokens

Use these rules together with the Agent 2 section inside `AI-docs/jobs/<page-slug>/tasks.md`.

Developers should not edit this file during normal project execution.

## Scope

Agent 2 owns design-token extraction, font setup, and semantic token wiring.

## Rules

- Extract tokens from Figma variables and styles without inventing values.
- Focus on primitives only during token setup: colors, typography, spacing, radii, shadows, and breakpoints only when they are explicit.
- Variables override styles when conflicts exist.
- Prefer existing semantic tokens before creating new ones.
- Do not invent missing scale steps.
- Do not overwrite Tailwind defaults unnecessarily.
- Keep Tailwind v4 token work in `frontend/app/globals.css` via `@theme`.
- Do not create component-specific global selector classes in `globals.css`.
- Token output must remain consumable from JSX through Tailwind utility classes.
- Use only font families already defined in approved tokens.
- Do not invent new fonts.
- Use `next/font` when possible and expose fonts through CSS variables and theme tokens.
- Do not implement page sections during this agent run.
