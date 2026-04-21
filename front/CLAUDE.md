# CLAUDE.md - Frontend (`front/`)

Jekyll static site generator with Svelte components. Builds at deployment time.

## Structure

```
front/
├── _includes/       Jekyll includes (partials, components)
├── _layouts/        Page layout templates
├── _data/           Data files (YAML, JSON)
├── _plugins/        Jekyll plugins
├── _services/       Business logic, helper modules
├── _ressources/     Reference docs and static assets
├── gestion-guides/  Guide management
├── lib-svelte/      Reusable Svelte components (see lib-svelte/CLAUDE.md)
├── assets/          Static assets (CSS, JS, images)
├── test/            Test files (Vitest)
├── Gemfile          Ruby dependencies
├── _config.yml      Jekyll configuration
└── *.html           Page templates
```

## Commands

```bash
# Development (from root)
pnpm dev              # Runs Jekyll in watch mode (+ backend, DB, Svelte)

# From front/ directory
pnpm watch            # Svelte watch (lib-svelte build)
pnpm build            # Svelte production build
pnpm test             # Run tests with Vitest

# Manual Jekyll commands (requires bundler)
bundler install       # Install gems
bundler exec jekyll build   # Build static site
bundler exec jekyll serve   # Local preview
```

## Jekyll Development

**Prerequisites:**
- Ruby (3.3+)
- bundler: `gem install bundler` (in `~/gems/`)
- Gems: `cd front && bundler install`

**Configuration:** `_config.yml` - build settings, environment variables, plugins

**Building:** Jekyll processes templates and data, outputs static HTML/CSS/JS to `_site/`

**Environment variables:** Passed via `.env` and plugin [jekyll-dotenv](https://rubydoc.info/gems/jekyll-dotenv). Available in templates as `site.data.env.*`

## Svelte Integration

Svelte components (`lib-svelte/`) build to `lib-svelte/dist/` and are included in Jekyll via `<script>` tags.

- Components should be self-contained, hydrating client-side
- Build: `pnpm --filter @anssi-portail/svelte build`
- Output: JavaScript bundles in `lib-svelte/dist/`

See [lib-svelte/CLAUDE.md](lib-svelte/CLAUDE.md) for component details.

## Testing

**Framework:** Vitest (JavaScript testing)

**Files:** `test/**/*.spec.ts` or `test/**/*.test.ts`

**Running:** `pnpm test` or `pnpm --filter @anssi-portail/front test`

**Scope:** Test Svelte components, utility functions, Jekyll plugin logic

## Content & Data

**YAML frontmatter:** Pages use Jekyll front matter for metadata:
```
---
layout: default
title: Page Title
---
```

**Data files:** `_data/` (`.yml`, `.json`) for shared data across pages

**Includes:** Reusable HTML snippets in `_includes/`

**Layouts:** Page templates in `_layouts/`

## Build & Deployment

In `Dockerfile`:
1. Svelte compiles to bundles
2. Jekyll builds static site with build-arg environment variables
3. Output (`_site/`) copied to runtime container
4. Served by Express backend

**Build variables (from CI/CD):**
- `GOOGLE_SEARCH_CONSOLE_VERIFICATION`
- `MATOMO_ID`, `MATOMO_URL_TAG_MANAGER`
- `SENTRY_DSN`, `SENTRY_ENVIRONNEMENT`

These are injected into `.env` and available in Jekyll.

## Ruby Gems

See `Gemfile` for installed gems. Key ones:
- `jekyll` - Static site generator
- `jekyll-dotenv` - Load `.env` into Jekyll
- Any custom plugins or dependencies

## Assets

Static assets (CSS, images, fonts) in `assets/`. Reference them in HTML/Jekyll layouts.

**CSS:** Check if Sass processing is configured (often via Jekyll plugins or bundled build step).

## Code Style

- HTML: Valid semantic HTML
- Ruby: Follow Jekyll conventions
- JavaScript/Svelte: See lib-svelte/CLAUDE.md
- Prettier applies to all `.js` and `.ts` files
