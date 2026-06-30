import path from 'node:path';
import type { Plugin } from 'vite';

export const plateformePlugin = (): Plugin => ({
  name: 'plateforme',

  resolveId(id, _importer, options) {
    if (!id.startsWith('$plateforme/')) {
      return null;
    }

    const nom = id.substring('$plateforme/'.length);

    const fichier = options?.ssr ? `src/plateforme/${nom}.serveur.ts` : `src/plateforme/${nom}.client.ts`;

    return path.resolve(fichier);
  },
});
