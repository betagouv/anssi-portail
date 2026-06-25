#!/usr/bin/env ts-node

import fs from 'fs';
import path from 'path';
import { adaptateurEnvironnement } from './adaptateurEnvironnement';
import { EntrepotGuideGrist } from './entrepotGuideGrist';

// --- Ajustez les imports selon votre arborescence
async function main() {
  try {
    const outDir = path.resolve(process.cwd(), 'src', 'content', 'guides');
    fs.mkdirSync(outDir, { recursive: true });

    // Instanciez votre adaptateur d'environnement comme dans votre projet
    const entrepot = new EntrepotGuideGrist({ adaptateurEnvironnement });

    console.log('Récupération des guides depuis Grist...');
    const guides = await entrepot.tous();

    console.log(`Écriture de ${guides.length} fichiers Markdown dans ${outDir} ...`);
    for (const guide of guides) {
      // Génère un slug sûr pour le nom de fichier
      const slug =
        (guide.id || guide.nom || '')
          .toString()
          .normalize('NFKD')
          .replace(/[\u0300-\u036f]/g, '') // retire accents
          .replace(/[^a-z0-9-_ ]/gi, '')
          .trim()
          .replace(/\s+/g, '-')
          .toLowerCase() || `guide-${Math.random().toString(36).slice(2, 8)}`;

      const filePath = path.join(outDir, `${slug}.md`);

      // Prépare frontmatter YAML
      const frontmatter: Record<string, any> = {
        id: guide.id,
        nom: guide.nom,
        langue: guide.langue || 'FR',
        collections: guide.collections || [],
        listeDocuments: guide.listeDocuments || [],
        dateMiseAJour: guide.dateMiseAJour ? guide.dateMiseAJour.toISOString() : undefined,
        thematique: guide.thematique || '',
        besoins: guide.besoins || [],
        lienCourt: guide.lienCourt || undefined,
      };

      // Sérialise frontmatter en YAML simple
      const yamlLines = ['---'];
      for (const [k, v] of Object.entries(frontmatter)) {
        if (v === undefined) continue;
        // Sérialisation simple pour tableaux et objets
        if (Array.isArray(v)) {
          yamlLines.push(`${k}:`);
          for (const item of v) {
            // échapper les strings contenant ":" ou "- "
            const safe = typeof item === 'string' ? item.replace(/"/g, '\\"') : item;
            yamlLines.push(`  - "${safe}"`);
          }
        } else if (typeof v === 'string') {
          const safe = v.replace(/"/g, '\\"');
          yamlLines.push(`${k}: "${safe}"`);
        } else {
          yamlLines.push(`${k}: ${JSON.stringify(v)}`);
        }
      }
      yamlLines.push('---');

      // Corps Markdown : description (vide si absent) + métadonnées additionnelles si besoin
      const description = guide.description ? guide.description.trim() : '';
      const body = description.length ? `${description}\n` : '';

      const content = yamlLines.join('\n') + '\n\n' + body;

      fs.writeFileSync(filePath, content, { encoding: 'utf8' });
    }

    console.log('Génération terminée.');
    process.exit(0);
  } catch (err) {
    console.error('Erreur lors de la génération des guides :', err);
    process.exit(1);
  }
}

main();
