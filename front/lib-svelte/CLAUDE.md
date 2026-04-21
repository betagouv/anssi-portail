# CLAUDE.md - Svelte Components (`front/lib-svelte/`)

Reusable Svelte component library built with Vite. Components are compiled to JavaScript and embedded in Jekyll pages.

## Structure

```
lib-svelte/
├── src/           Component source files (.svelte)
├── dist/          Compiled output (built by Vite)
├── vite.config.js Build configuration
├── tsconfig.json  TypeScript configuration
├── package.json   Dependencies and build scripts
└── test/          Component tests (Vitest)
```

## Commands

```bash
# From root
pnpm --filter @anssi-portail/svelte watch    # Watch mode
pnpm --filter @anssi-portail/svelte build    # Production build

# From front/lib-svelte/
pnpm watch                                    # Same as above
pnpm build                                    # Same as above
pnpm test                                     # Run tests
```

## Building & Output

**Build tool:** Vite (configured in `vite.config.js`)

**Input:** Svelte components in `src/`

**Output:** `dist/` contains compiled JavaScript bundles ready to hydrate in HTML

**Usage in Jekyll:** Include script tags in Jekyll templates to load components:

```html
<div id="my-component"></div>
<script src="/lib-svelte/dist/MyComponent.js"></script>
```

## Component Structure

Svelte components (`.svelte` files) contain template, script, and styles in one file.

**Export:** Components should export a default Svelte component to be mountable from HTML.

**Props:** Pass data to components via props; bind to HTML element data attributes if needed.

**Styling:** Scoped CSS within `<style>` blocks; global styles in main app or shared CSS.

## TypeScript

Svelte supports TypeScript via `<script lang="ts">` blocks.

**Type safety:** Use strict mode (enabled in `tsconfig.json`)

**Component props:** Define interfaces for prop types

## Testing

**Framework:** Vitest + testing-library (standard for component testing)

**Files:** `test/**/*.spec.ts`

**Pattern:** Test component rendering, props, events, user interactions

## Integration with Jekyll

Components are **pre-built to JavaScript** in the Dockerfile:

1. Svelte source → compiled to `dist/`
2. `dist/` output copied into Jekyll build
3. Jekyll includes script tags to load components
4. JavaScript hydrates components on page load in browser

**No SSR:** Components are client-side only. Jekyll serves static HTML; Svelte adds interactivity.

## Dependencies

See `package.json` for build dependencies (Vite, Svelte compiler, etc.) and runtime dependencies if any.

Key expected:

- `svelte` - Component framework
- `vite` - Build tool
- `vitest` - Testing framework
- `typescript` - Type checking

## Entry Point

Main source file typically `src/index.js` or individual component files. Check `package.json` `main` field and `vite.config.js` for entry points.

## Code Style

- Svelte conventions (reactive statements, event handling, slot usage)
- TypeScript strict mode
- Prettier formatting (120-char lines, single quotes, trailing commas)
- Component names: PascalCase
- Reactive variables: camelCase

## Build Artifacts

After `pnpm build`, `dist/` contains:

- `*.js` - Component modules
- `*.css` - Component styles (if split)
- `*.map` - Source maps (if enabled)

These files are static assets served by the backend.
