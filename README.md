# 🚀 Next.js + Sanity Boilerplate

A production-ready starter combining [Next.js](https://nextjs.org/) App Router with [Sanity Studio](https://www.sanity.io/) — includes real-time visual editing, a drag-and-drop page builder, live content updates, and an AI-powered setup workflow.

---

## ✨ Features

- **Next.js App Router** — Blazing-fast performance with SSR, SSG, and ISR support
- **Sanity Studio (embedded)** — Real-time CMS running at `/studio`
- **Live Content API** — Dynamic experiences without polling or rebuilds
- **Drag-and-Drop Page Builder** — Modular components with visual editing
- **AI Assist** — Auto-generate image alt text via Sanity AI Assist
- **On-demand Revalidation** — Instant publishing without full rebuilds

---

## 📋 Prerequisites

- Node.js 18+
- A [Sanity account](https://www.sanity.io/login) (free tier works)
- Sanity CLI: `npm install -g sanity@latest`

---

## 🛠 Setup Guide

### Step 1 — Clone & Install

```bash
# Initialize from the Sanity template
npm create sanity@latest -- --template sanity-io/sanity-template-nextjs-clean

# Or clone this repo directly
git clone <your-repo-url>
cd <your-app-name>
npm install
```

---

### Step 2 — Create a Sanity Project

If you don't have a Sanity project yet, create one now:

```bash
# Login to Sanity CLI
npx sanity login

# Create a new project (follow the prompts)
npx sanity init --create-project "<Your Project Name>" --dataset production
```

You'll receive a **Project ID** — save it, you'll need it for the `.env` files.

Alternatively, create a project from the dashboard:
1. Go to [sanity.io/manage](https://www.sanity.io/manage)
2. Click **"New project"**
3. Note your **Project ID** from the project settings

---

### Step 3 — Generate API Tokens

You need two tokens: one **read-only** (for the Next.js frontend) and one **read+write** (for Sanity Studio mutations and previews).

#### Via Sanity Dashboard (recommended)

1. Go to [sanity.io/manage](https://www.sanity.io/manage) → select your project
2. Navigate to **API** → **Tokens**
3. Click **"Add API token"**

**Read Token (for frontend):**
- Name: `frontend-read-token`
- Permissions: **Viewer**
- Click **Save** → copy the token immediately (it won't be shown again)

**Read+Write Token (for Studio/mutations):**
- Name: `studio-write-token`
- Permissions: **Editor**
- Click **Save** → copy the token immediately

#### Via CLI

```bash
# Read token
npx sanity token create --label "frontend-read-token" --role viewer

# Read+Write token
npx sanity token create --label "studio-write-token" --role editor
```

---

### Step 4 — Configure Environment Variables

#### Frontend (`/frontend/.env.local`)

```bash
# Copy the example file
cp frontend/.env.example frontend/.env.local
```

Then fill in your values:

```env
# ── Sanity Project Config ──────────────────────────────────────────
NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2024-01-01"

# ── Sanity Tokens ──────────────────────────────────────────────────
# Read-only token (Viewer role) — used for fetching published content
SANITY_API_READ_TOKEN="your-read-token-here"

# Read+Write token (Editor role) — used for draft previews & mutations
SANITY_API_WRITE_TOKEN="your-write-token-here"

# ── App Config ─────────────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# ── Sanity Preview Secret ──────────────────────────────────────────
# Generate with: openssl rand -base64 32
SANITY_PREVIEW_SECRET="your-random-secret-here"
```

#### Studio (`/studio/.env`)

```bash
cp studio/.env.example studio/.env
```

```env
# ── Sanity Project Config ──────────────────────────────────────────
SANITY_STUDIO_PROJECT_ID="your-project-id"
SANITY_STUDIO_DATASET="production"

# ── Preview URL ────────────────────────────────────────────────────
SANITY_STUDIO_PREVIEW_URL="http://localhost:3000"
```

> ⚠️ **Never commit `.env.local` or `.env` files.** Both are already in `.gitignore`.

---

### Step 5 — Start Development Servers

```bash
# From the project root — starts both Next.js and Sanity Studio
npm run dev
```

| Service | URL |
|---|---|
| Next.js App | http://localhost:3000 |
| Sanity Studio | http://localhost:3333 |

---

## 📁 Project Structure

```
.
├── frontend/                  # Next.js app
│   ├── app/                   # App Router pages & layouts
│   ├── components/            # Reusable UI components
│   ├── sanity/                # Sanity client, queries, utils
│   └── .env.local             # ← your frontend env vars (git-ignored)
│
├── studio/                    # Sanity Studio
│   ├── src/
│   │   └── schemaTypes/       # Content schema definitions
│   └── .env                   # ← your studio env vars (git-ignored)
│
└── README.md
```

---

## 🚢 Deployment

### Deploy Sanity Studio

```bash
cd studio
npx sanity deploy
```

Studio will be live at `https://<your-project-name>.sanity.studio`.

### Deploy Next.js to Vercel

1. Push your repo to GitHub
2. Import into [Vercel](https://vercel.com/new)
3. Set **Root Directory** to `frontend`
4. Add all environment variables from `frontend/.env.local` into Vercel's project settings
5. Deploy 🎉

---

## 👥 Inviting Collaborators

1. Go to [sanity.io/manage](https://www.sanity.io/manage) → select your project
2. Click **"Invite project members"**
3. Share the deployed Studio URL with your team

---

## 📚 Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity CLI Reference](https://www.sanity.io/docs/cli)
- [Sanity AI Assist](https://www.sanity.io/ai-assist)
- [Join the Sanity Community](https://slack.sanity.io)
- [Sanity + Vercel Guide](https://www.sanity.io/guides/vercel-integration)

---

## 🔐 Security Notes

- Use the **Viewer** (read-only) token for the frontend — never expose write tokens to the client
- Rotate tokens via [sanity.io/manage](https://www.sanity.io/manage) if they are ever leaked
- Add CORS origins for your production domain under **API** → **CORS origins** in your Sanity project settings
- The `SANITY_PREVIEW_SECRET` should be a long, random string — generate one with `openssl rand -base64 32`