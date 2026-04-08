import type { EtatQuestionnaire } from '../../../../../back/src/metier/nis2-simulateur/EtatQuestionnaire';
import type { SecteurSimple } from '../../../../../back/src/metier/nis2-simulateur/SecteurActivite.definitions';
import type { SousSecteurActivite } from '../../../../../back/src/metier/nis2-simulateur/SousSecteurActivite.definitions';
import { non } from '../../../../../back/src/metier/nis2-simulateur/commun.predicats';
import { estUnSecteurAvecDesSousSecteurs } from './SecteurActivite.predicats';
import { estSousSecteurListe } from './SousSecteurActivite.predicats';

export const selectSecteursPourSaisieActivites = (
  etat: EtatQuestionnaire
): (SecteurSimple | SousSecteurActivite)[] => {
  const elements = [...etat.secteurActivite, ...etat.sousSecteurActivite];
  const sansSousSecteurs = elements
    .filter(non(estUnSecteurAvecDesSousSecteurs))
    .filter(estSousSecteurListe);

  return sansSousSecteurs as (SecteurSimple | SousSecteurActivite)[];
};
