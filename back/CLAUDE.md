# CLAUDE.md - Backend (`back/`)

Node.js/TypeScript Express API server with PostgreSQL and Knex migrations.

## Architecture

```
src/
├── api/           HTTP endpoints, middleware, request/response handlers
├── infra/         Adapters: database, email, encryption, S3, OIDC, hashing, caching
├── metier/        Domain logic: business rules, transformations
├── bus/           Event bus for decoupled inter-service communication
└── admin/         Console for operational tasks (key rotation, re-hashing)
migrations/        Knex database schema migrations (timestamped .ts files)
tests/             Test files mirroring src structure (*.spec.ts)
```

**Key pattern:** Infrastructure adapters isolate external dependencies, allowing business logic to remain independent of implementation details.

## Commands

```bash
# Development
pnpm --filter @anssi-portail/back dev           # Watch mode with migrations
pnpm --filter @anssi-portail/back dev:server    # Just the server (not DB)

# Testing
pnpm --filter @anssi-portail/back test          # Run all tests
node --import tsx --test tests/path/to/file.spec.ts  # Single file

# Quality
pnpm --filter @anssi-portail/back lint          # ESLint
pnpm --filter @anssi-portail/back lint:fix      # Auto-fix
pnpm --filter @anssi-portail/back format        # Prettier
pnpm --filter @anssi-portail/back typecheck     # TypeScript check (no emit)

# Build
pnpm --filter @anssi-portail/back build         # Compile to dist/
```

## Testing

**Framework:** Node's built-in test runner (no extra setup needed)

**Files:** `tests/**/*.spec.ts`

**Mocks:** Common fakes in `tests/fauxObjets.ts` (mock HTTP requests, database records, etc.)

**Structure:** Mirror the src structure for test organization:

- `tests/api/` for API tests
- `tests/infra/` for infrastructure tests
- `tests/metier/` for business logic tests

**Database testing:** Tests can use a real database or mocks, configured via `.env` or test setup.

## Database & Migrations

**Tech:** PostgreSQL + Knex

**Migrations directory:** `migrations/` at root of back package

**Format:** TypeScript files with `up()` and `down()` functions

**Creating:** Create timestamped files manually, e.g., `20250101000000_descriptionDeLaMigration.ts`

**Running:**

- Automatic during `pnpm dev` (via concurrently)
- Manual: `pnpm migre-bdd` from root
- Production: `pnpm migre-bdd:clever` (uses compiled knexfile)

**Knex config:** `knexfile.ts` at root of back package

## Admin Console

Access with `pnpm admin` (production) or `pnpm admin:dev` (auto-build).

**Common operations:**

```
> await admin.sauvegardeLesEmpreintesDesSecretsDeHachage()    // Generate hashing secrets
> await admin.migreToutLesHaches(2, 'newSalt')               // Re-hash all data
> await admin.remplaceLaCleDeChiffrement('old', 'new')        // Rotate encryption key
```

See `src/admin/consoleAdministration.ts` for all methods.

## Key Dependencies

- **Express:** HTTP server
- **Knex:** Database abstraction & migrations
- **postgres (pg):** PostgreSQL driver
- **JWT/OpenID-Client:** Authentication
- **AWS SDK:** S3/Cellar storage
- **Brevo:** Email service
- **Sentry:** Error tracking
- **axios:** HTTP client
- **zod:** Runtime schema validation
- **bcrypt:** Password hashing

## Entry Point

`src/serveur.ts` - Sets up Express, initializes infrastructure adapters, mounts routes, starts server on port 3000.

## Environment Variables

Required keys (from `.env`):

- `DATABASE_URL` or `PG_*` - PostgreSQL connection
- `JWT_SECRET` - Token signing
- `CHIFFREMENT_CHACHA20_CLE_HEX` - Encryption key
- `HACHAGE_SECRET_DE_HACHAGE_*` - Hashing secrets (initialize via admin console)
- `BREVO_API_KEY` - Email service
- `OIDC_*` - OpenID Connect providers
- `S3_BUCKET`, `AWS_*` - Storage
- `SENTRY_DSN` - Error tracking
- Service API keys (Grist, Mattermost, CMS, etc.)

## Code Style

- ESLint + TypeScript strict mode
- Prettier: 120-char lines, single quotes, trailing commas
- No console.log in production code (use logging adapters)
