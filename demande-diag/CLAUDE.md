# CLAUDE.md - Demande Diag Web Component

Svelte-based Web Component that runs independently. Deployed as a CDN-hosted JavaScript file for embedding in external portals.

## Purpose

Interactive diagnostic form/questionnaire Web Component that can be embedded in other websites via a single `<script>` tag.

## Structure

```
demande-diag/
├── src/           Svelte components (.svelte, .ts)
├── dist-demo/     Build output for demo environment
├── dist-prod/     Build output for production environment
├── tests/         Test files
├── package.json   Build scripts
└── vite.config.ts Vite configuration
```

## Commands

```bash
# From root
pnpm --filter demande-diag build:demo   # Build for demo
pnpm --filter demande-diag build:prod   # Build for production

# From demande-diag/
pnpm build:demo
pnpm build:prod
```

## Build & Deployment

**Build process:**
1. Vite compiles Svelte components with environment-specific config
2. Outputs JavaScript bundle to `dist-demo/` or `dist-prod/`
3. Bundle is uploaded to Cellar (S3-compatible storage)

**Environment variables (passed at build time):**
- `VITE_API_URL` - API endpoint (different per environment)
- `ENV` - Environment name (demo vs prod)

**API URLs:**
- Demo: `https://demo.messervicescyber.beta.gouv.fr`
- Prod: `https://messervices.cyber.gouv.fr`

## Deployment Process

See `README.md` in this directory. Summary:
1. Update `version` in `package.json`
2. Push to GitHub
3. Manually trigger "Déploiement WebComponent demande de diag" workflow
4. Workflow builds both demo and prod, uploads to Cellar

## Web Component Usage

Embedded in external sites as:
```html
<script src="https://cdn.url/demande-diag.js"></script>
<demande-diag></demande-diag>
```

**Constraints:**
- Must be self-contained (no external dependencies expected in consumer HTML)
- API calls to configured `VITE_API_URL`
- Styling isolated to component

## Code Style

- Svelte + TypeScript
- Prettier formatting
- ESLint checks
- Sass for styling (if used)

## Dependencies

Key dev dependencies:
- `svelte` - Component framework
- `vite` - Build tool
- `@sveltejs/vite-plugin-svelte` - Svelte compiler for Vite
- `typescript`, `eslint`, `prettier` - Quality tools

Runtime:
- `@anssi-portail/svelte` - Shared Svelte components from main portal
- `axios` - HTTP requests

## Testing

Tests in `tests/` directory (likely Vitest-based).

Run with: `pnpm test` (if configured)

## Development Workflow

1. Edit Svelte components in `src/`
2. Build locally: `pnpm build:demo`
3. Check output in `dist-demo/`
4. Test integration in external site
5. Bump version in `package.json`
6. Push to GitHub
7. Trigger deployment workflow
