# CLAUDE.md - Mise à jour Financements

Utility script to sync and update financing data. Runs independently from the main portal.

## Purpose

Periodically fetches financing data from external sources and updates the portal database or exports.

## Structure

```
mise-a-jour-financements/
├── src/           TypeScript source code
├── tests/         Test files (*.spec.ts)
├── .env           Environment variables
└── package.json   Script entry points
```

## Commands

```bash
# From root or this directory
pnpm --filter mise-a-jour-financements dev      # Run with .env files loaded
pnpm --filter mise-a-jour-financements start    # Run without .env
pnpm --filter mise-a-jour-financements test     # Run tests
pnpm --filter mise-a-jour-financements lint     # Check linting
pnpm --filter mise-a-jour-financements lint:fix # Auto-fix
```

## Dependencies

- `axios` - HTTP requests
- `diff` - Diff library (for comparing changes)
- `isomorphic-dompurify` - HTML sanitization

## Entry Point

`src/index.ts` - Main script logic

## Environment

Create `.env` based on `.env.template`. Typically includes:
- Database credentials (if updating portal DB)
- External service API keys
- Configuration for data sources

## Running

```bash
# Development (loads .env and parent .env)
pnpm dev

# Production
node --import tsx src/index.ts
```

## Integration

This script likely runs:
- On a schedule (cron job, CI/CD workflow)
- To sync data from external systems (Grist, spreadsheets, etc.)
- To populate the portal database with updated financing information
