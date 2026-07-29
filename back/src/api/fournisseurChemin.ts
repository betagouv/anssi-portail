import { readdirSync } from 'node:fs';
import { join } from 'path';
import { ErreurTraverséeDeChemin } from './erreurs.js';

export class FichierInconnu extends Error {
  constructor(chemin: string) {
    super(`Fichier inconnu ${chemin}`);
  }
}

const valideChemin = (nomFichier: string): void => {
  const decodedPath = decodeURIComponent(nomFichier);
  if (decodedPath.includes('..') || decodedPath.startsWith('/') || decodedPath.startsWith('\\')) {
    throw new ErreurTraverséeDeChemin(`Tentative de path traversal détectée: ${nomFichier}`);
  }
};

export interface FournisseurChemin {
  front: {
    sitemapXml(): string;
  };
  back: {
    csvNis2Simulateur: () => string;
  };
  versPageJekyll: (nomPage: string) => string;
  versRessourceJekyll: (...morceauxChemin: string[]) => string;
}

export const construisListeFichiersDuSite = (racine: string) => {
  const repertoireAbsolu = join(process.cwd(), racine);
  return readdirSync(repertoireAbsolu, {
    recursive: true,
  }).map((fichier) => join(repertoireAbsolu, fichier as string));
};

const construisCheminVersArtefactJekyll = (...morceauxChemin: string[]): string => {
  for (const morceau of morceauxChemin) {
    valideChemin(morceau);
  }
  const chemin = join(process.cwd(), 'front', '_site', ...morceauxChemin);
  if (!siteFront.fichiers().includes(chemin)) {
    throw new FichierInconnu(chemin);
  }
  return chemin;
};

export const fournisseurChemin: FournisseurChemin = {
  front: {
    sitemapXml: () => join(process.cwd(), 'front', 'assets', 'sitemap.xml'),
  },
  back: {
    csvNis2Simulateur: () =>
      join(process.cwd(), 'back', 'src', 'metier', 'nis2-simulateur', 'questionnaire', 'specifications-completes.csv'),
  },
  versPageJekyll: (nomPage: string) => construisCheminVersArtefactJekyll(nomPage, 'index.html'),
  versRessourceJekyll: (...morceauxChemin: string[]) => construisCheminVersArtefactJekyll(...morceauxChemin),
};

const cacheFichiers: string[] = [];

export const siteFront = {
  fichiers: () => {
    if (cacheFichiers.length === 0) {
      cacheFichiers.push(...construisListeFichiersDuSite('front/_site'));
    }
    return cacheFichiers;
  },
};
