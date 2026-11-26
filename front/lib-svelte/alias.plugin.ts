import { resolve } from 'node:path';
import type { Plugin } from 'vite';

import tsconfig from './tsconfig.json' with { type: 'json' };

const préfixePlateforme = '@plateforme/';
const alias = Object.entries(tsconfig.compilerOptions.paths)
  .filter(([motif]) => motif !== '@plateforme/*')
  .map(([motif, [chemin]]) => ({
    find: motif.slice(0, -2),
    replacement: resolve(import.meta.dirname, chemin.slice(0, -2)),
  }));

export const aliasSvelte = (): Plugin => ({
  name: 'alias-svelte',

  config: () => ({ resolve: { alias } }),

  resolveId(id, _importer, options) {
    if (!id.startsWith(préfixePlateforme)) return null;

    const chemin = resolve(import.meta.dirname, 'src/plateforme', id.slice(préfixePlateforme.length));
    return `${chemin}.${options.ssr ? 'serveur' : 'client'}.ts`;
  },
});
