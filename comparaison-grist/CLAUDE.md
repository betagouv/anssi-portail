# CLAUDE.md - Comparaison Grist

Utility for comparing and synchronizing data with Grist spreadsheets.

## Structure

```
comparaison-grist/
├── src/           TypeScript source code
├── tests/         Test files (*.spec.ts)
├── package.json   Dependencies and scripts
└── vitest.config.js Testing configuration
```

## Commands

```bash
# From root or this directory
pnpm --filter comparaison-grist dev:guides:compare      # Compare guides (dev mode)
pnpm --filter comparaison-grist start:guides:compare    # Compare guides (production)
pnpm --filter comparaison-grist lint                    # Check code style
pnpm --filter comparaison-grist lint:fix                # Auto-fix
pnpm --filter comparaison-grist test                    # Run tests (Vitest + typecheck)
pnpm --filter comparaison-grist typecheck               # TypeScript type check
```

## Purpose

Compare guides and other content with Grist spreadsheets:
- Fetches data from Grist (external spreadsheet/database service)
- Compares with portal content
- Detects differences and generates diffs
- Used to validate and sync content

## Dependencies

- `axios` - HTTP requests
- `diff` - Diff/patch library
- `isomorphic-dompurify` - HTML sanitization
- TypeScript, ESLint - Quality tools

## Entry Points

- `src/guides.ts` - Main script for comparing guides
- `src/index.ts` - Library exports (if used as a module)

## Usage

Can be run as a standalone script:
```bash
pnpm start:guides:compare  # Compare guides with Grist
```

Or in dev mode with auto-reload via `.env` configuration.

## Testing

Vitest configuration. Run with: `pnpm test`
