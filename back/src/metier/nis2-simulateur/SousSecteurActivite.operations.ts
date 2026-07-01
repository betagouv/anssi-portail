import type { SousSecteurActivite } from './SousSecteurActivite.definitions.js';
import type { SecteurActivite } from './SecteurActivite.definitions.js';
import { sousSecteursParSecteur } from './SousSecteurActivite.valeurs.js';

export const secteurDe = (recherche: SousSecteurActivite): SecteurActivite => {
  const tupleDuSecteur = Object.entries(sousSecteursParSecteur).find(([, sousSecteurs]) =>
    sousSecteurs.includes(recherche)
  );

  return tupleDuSecteur![0] as SecteurActivite;
};
