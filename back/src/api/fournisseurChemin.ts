import { readdirSync } from 'node:fs';
import { join } from 'path';
import { ErreurTraverséeDeChemin } from './erreurs.js';
import { CodeRegion } from '../metier/referentielRegions.js';

export class FichierInconnu extends Error {
  constructor(chemin: string) {
    super(`Fichier inconnu ${chemin}`);
  }
}

export interface FournisseurChemin {
  front: {
    sitemapXml: () => string;
    police: (nomDePolice: string) => string;
  };
  back: {
    csvNis2Simulateur: () => string;
    attestationTypCyberdepart: () => string;
    badgePngRécompenseCyberdepart: () => string;
    banniereSvgRécompenseCyberdepart: () => string;
  };
  jekyll: {
    page404: () => string;
    pageMaintenance: () => string;
    robotsTxt: () => string;

    page: (nom: string) => string;
    ressource: (nom: string) => string;
    contact: (codeRegion: CodeRegion) => string;
    service: (nom: string) => string;
    composantSvelteCompilé: (nom: string) => string;

    assets: () => string;
    scripts: () => string;
    libSvelte: () => string;
    favicon: () => string;
  };
}

const valideChemin = (nomFichier: string): void => {
  const decodedPath = decodeURIComponent(nomFichier);
  if (decodedPath.includes('..') || decodedPath.startsWith('/') || decodedPath.startsWith('\\')) {
    throw new ErreurTraverséeDeChemin(`Tentative de path traversal détectée: ${nomFichier}`);
  }
};

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
    police: (nomDePolice: string) => join(process.cwd(), 'front', 'assets', 'fonts', nomDePolice),
  },
  back: {
    csvNis2Simulateur: () =>
      join(process.cwd(), 'back', 'src', 'metier', 'nis2-simulateur', 'questionnaire', 'specifications-completes.csv'),
    attestationTypCyberdepart: () =>
      join(
        process.cwd(),
        'back',
        'src',
        'api',
        'mesures',
        'ressourceRecompensesCyberDepart',
        'attestation',
        'attestation.typ'
      ),
    badgePngRécompenseCyberdepart: () =>
      join(process.cwd(), 'back', 'src', 'api', 'mesures', 'ressourceRecompensesCyberDepart', 'badge.png'),
    banniereSvgRécompenseCyberdepart: () =>
      join(process.cwd(), 'back', 'src', 'api', 'mesures', 'ressourceRecompensesCyberDepart', 'banniere.svg'),
  },
  jekyll: {
    page404: () => construisCheminVersArtefactJekyll('404.html'),
    pageMaintenance: () => construisCheminVersArtefactJekyll('maintenance.html'),
    robotsTxt: () => construisCheminVersArtefactJekyll('robots.txt'),

    page: (nom: string) => construisCheminVersArtefactJekyll(nom, 'index.html'),
    ressource: (nom: string) => construisCheminVersArtefactJekyll('ressources', nom),
    contact: (nom: string) => construisCheminVersArtefactJekyll('contacts', nom),
    service: (nom: string) => construisCheminVersArtefactJekyll('services', nom),
    composantSvelteCompilé: (nom: string) =>
      construisCheminVersArtefactJekyll('lib-svelte', 'dist', 'serveur', 'assets', `${nom}.js`),

    assets: () => construisCheminVersArtefactJekyll('assets'),
    scripts: () => construisCheminVersArtefactJekyll('scripts'),
    libSvelte: () => construisCheminVersArtefactJekyll('lib-svelte'),
    favicon: () => construisCheminVersArtefactJekyll('favicon.ico'),
  },
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
