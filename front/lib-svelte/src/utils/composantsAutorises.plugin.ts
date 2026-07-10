import { writeFile } from 'node:fs/promises';
import type { Plugin } from 'vite';

/**
 * Génère, à chaque build SSR, un module TypeScript listant les composants exposés.
 * Le fichier est déposé dans le back (et non lu depuis le front) afin que le back
 * n'ait aucune dépendance vers la configuration Vite du front.
 */
export const emetComposantsAutorisés = (composantsAutorisés: string[], cheminDeSortie: string): Plugin => ({
  name: 'emet-composants-autorisés',
  async writeBundle() {
    console.log('📝 Génération du manifeste des composants autorisés');
    const liste = composantsAutorisés.map((nom) => `\n  '${nom}'`).join(',');
    const contenu = `// Fichier généré automatiquement au build Svelte (emetComposantsAutorisés). Ne pas modifier à la main.
export const composantsAutorisés: string[] = [${liste},\n];
`;
    await writeFile(cheminDeSortie, contenu, 'utf-8');
    console.log('✅');
  },
});
