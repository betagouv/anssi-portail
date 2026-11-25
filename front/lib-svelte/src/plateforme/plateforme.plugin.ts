import path from 'node:path';
import type { Plugin } from 'vite';

export const plateformePlugin = (racine = path.resolve('src/plateforme')): Plugin => ({
  name: 'plateforme',

  resolveId(id, _importer, options) {
    if (!id.startsWith('$plateforme/')) {
      return null;
    }

    const nom = id.substring('$plateforme/'.length);

    const fichier = options?.ssr ? `${nom}.serveur.ts` : `${nom}.client.ts`;

    return path.resolve(racine, fichier);
  },
});
