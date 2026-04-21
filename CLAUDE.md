# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**anssi-portail** is a monorepo containing the ANSSI web portal: a backend API server (Node.js/Express/TypeScript) with PostgreSQL, and a frontend with Jekyll static site generator and Svelte components.

**Tech stack:**
- Backend: Node.js (>=24), TypeScript, Express, PostgreSQL
- Frontend: Jekyll + Svelte
- Package manager: pnpm (v10.24.0)
- Deployment: Docker (multi-stage), CleverCloud

## Workspace Modules

- [back/](back/CLAUDE.md) - Express API server, database, business logic
- [front/](front/CLAUDE.md) - Jekyll static site and templates
- [front/lib-svelte/](front/lib-svelte/CLAUDE.md) - Reusable Svelte components
- [mise-a-jour-financements/](mise-a-jour-financements/CLAUDE.md) - Data sync utility for financing information
- [demande-diag/](demande-diag/CLAUDE.md) - Web Component for diagnostic questionnaire
- [comparaison-grist/](comparaison-grist/CLAUDE.md) - Utility for comparing content with Grist spreadsheets

## Essential Commands

```bash
# Setup
pnpm install --frozen-lockfile
docker compose up db                  # PostgreSQL
pnpm migre-bdd                        # Database migrations
pnpm admin:dev                        # Initialize hashing secrets

# Development
pnpm dev                              # All servers (backend, frontend, Jekyll, DB)
pnpm build && pnpm start              # Production mode

# Quality
pnpm test                             # Run all tests
pnpm lint && pnpm format              # Check and fix code style
```

## Configuration

Copy `.env.template` to `.env` and fill in:
- Database credentials (auto-configured for Docker dev setup)
- Authentication secrets (JWT, OIDC)
- External service APIs (Brevo email, S3, Sentry)
- Portal config (Matomo, Google Search Console)

## Code Style

- Prettier: printWidth 120, singleQuote, trailingComma es5
- ESLint + TypeScript in backend
- Prek pre-commit hooks run `pnpm format`
- **Always use `pnpm`, not `npm`** (enforced in preinstall script)

## Docker & Deployment

Multi-stage build creates static site + compiled backend. See `Dockerfile` for:
1. Svelte build
2. Jekyll build (with build-arg variables for tracking, Sentry)
3. TypeScript compilation
4. Alpine runtime

Build variables: `GOOGLE_SEARCH_CONSOLE_VERIFICATION`, `MATOMO_ID`, `MATOMO_URL_TAG_MANAGER`, `SENTRY_DSN`, `SENTRY_ENVIRONNEMENT`

## Common Pitfalls

- Database must be running: `docker compose up db` before `pnpm dev`
- Use `--frozen-lockfile` in CI
- Copy `.env.template` before first run
- Initialize hashing secrets with `pnpm admin:dev` on fresh database
- Jekyll build failures usually = missing build-arg variables
