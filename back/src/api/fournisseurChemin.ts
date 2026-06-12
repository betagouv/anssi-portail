import { readdirSync } from 'node:fs';
import { join } from 'path';
import { PathTraversalError } from './erreurs';

const valideChemin = (nomFichier: string): void => {
  const decodedPath = decodeURIComponent(nomFichier);
  if (decodedPath.includes('..') || decodedPath.startsWith('/') || decodedPath.startsWith('\\')) {
    throw new PathTraversalError(`Tentative de path traversal détectée: ${nomFichier}`);
  }
};

export interface FournisseurChemin {
  cheminPageJekyll: (nomPage: string) => string;
  cheminProduitJekyll: (typologie: string, idProduit: string) => string;
  ressourceDeBase: (ressource: string) => string;
  cheminCsvNis2Simulateur: () => string;
}

export const construisListeFichiersDuSite = (racine: string) => {
  const repertoireAbsolu = join(process.cwd(), racine);
  return readdirSync(repertoireAbsolu, {
    recursive: true,
  }).map((fichier) => join(repertoireAbsolu, fichier as string));
};

const construisChemin = (...morceauxChemin: string[]): string => {
  for (const morceau of morceauxChemin) {
    valideChemin(morceau);
  }
  const chemin = join(process.cwd(), 'front', '_site', ...morceauxChemin);
  if (!siteFront.fichiers().includes(chemin)) {
    throw new Error(`Fichier inconnu ${chemin}`);
  }
  return chemin;
};

export const fournisseurChemin: FournisseurChemin = {
  cheminPageJekyll: (nomPage: string) => construisChemin(nomPage, 'index.html'),
  cheminProduitJekyll: (repertoireProduits: string, idProduit: string) =>
    construisChemin(repertoireProduits, idProduit),
  ressourceDeBase: (ressource) => construisChemin(ressource),
  cheminCsvNis2Simulateur: () =>
    join(process.cwd(), 'back', 'src', 'metier', 'nis2-simulateur', 'questionnaire', 'specifications-completes.csv'),
};

const cacheFichiers: string[] = [];

export const siteFront = {
  fichiers: () => {
    if (cacheFichiers.length === 0) {
      cacheFichiers.push(...construisListeFichiersDuSite('front'));
    }
    return cacheFichiers;
  },
};
