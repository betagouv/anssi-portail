import { writable } from 'svelte/store';
import type { ActionQuestionnaire } from './actions';
import type { EtatQuestionnaire } from '../../../../../back/src/metier/nis2-simulateur/EtatQuestionnaire';
import { EtatQuestionnaireVide } from '../../../../../back/src/metier/nis2-simulateur/EtatQuestionnaire';
import { certains, tous } from './arrays.predicats';
import {
  doitPasserParLocalisationEtablissementPrincipal,
  doitPasserParLocalisationFournitureServicesNumeriques,
  estSecteurAutre,
  estUnSecteurAvecDesSousSecteurs,
} from './SecteurActivite.predicats';
import { estSousSecteurAutre } from './SousSecteurActivite.predicats';
import { ou } from '../../../../../back/src/metier/nis2-simulateur/commun.predicats';

const etatInitial = () => EtatQuestionnaireVide;

const { set, subscribe, update } = writable<EtatQuestionnaire>(etatInitial());

const reset = () => {
  set(etatInitial());
};

const repond = (reponse: ActionQuestionnaire) => {
  switch (reponse.type) {
    case 'VALIDE_ETAPE_PREALABLE':
      set({
        ...etatInitial(),
        etapeCourante: 'designationOperateurServicesEssentiels',
      });
      break;

    case 'VALIDE_ETAPE_DESIGNATION':
      update((etat) => ({
        ...etat,
        etapeCourante: 'appartenanceUnionEuropeenne',
        designationOperateurServicesEssentiels: reponse.designations,
      }));
      break;

    case 'VALIDE_ETAPE_APPARTENANCE_UE':
      update((etat) => ({
        ...etat,
        etapeCourante: 'typeStructure',
        appartenancePaysUnionEuropeenne: reponse.appartenances,
      }));
      break;

    case 'VALIDE_ETAPE_TYPE_STRUCTURE':
      update((etat) => ({
        ...etat,
        etapeCourante: 'tailleEntitePrivee',
        typeStructure: reponse.types,
      }));
      break;

    case 'VALIDE_ETAPE_TAILLE_ENTITE_PRIVEE':
      update((etat) => ({
        ...etat,
        etapeCourante: 'secteursActivite',
        trancheNombreEmployes: reponse.nombreEmployes,
        trancheChiffreAffaire: reponse.chiffreAffaire,
        trancheBilanFinancier: reponse.bilanFinancier,
      }));
      break;

    case 'VALIDE_ETAPE_SECTEURS_ACTIVITE': {
      const prochaineEtape = tous(estSecteurAutre)(reponse.secteurs)
        ? 'resultat'
        : certains(estUnSecteurAvecDesSousSecteurs)(reponse.secteurs)
          ? 'sousSecteursActivite'
          : 'activites';

      update((etat) => ({
        ...etat,
        etapeCourante: prochaineEtape,
        secteurActivite: reponse.secteurs,
      }));
      break;
    }

    case 'VALIDE_ETAPE_SOUS_SECTEURS_ACTIVITE':
      update((etat) => {
        const prochaineEtape =
          etat.secteurActivite.every(
            ou(estSecteurAutre, estUnSecteurAvecDesSousSecteurs)
          ) && reponse.sousSecteurs.every(estSousSecteurAutre)
            ? 'resultat'
            : 'activites';

        return {
          ...etat,
          etapeCourante: prochaineEtape,
          sousSecteurActivite: reponse.sousSecteurs,
        };
      });
      break;

    case 'VALIDE_ETAPE_ACTIVITES':
      update((etat) => {
        const versEtablissement =
          doitPasserParLocalisationEtablissementPrincipal(
            etat.secteurActivite,
            reponse.activites
          );

        const versServicesNumeriques =
          doitPasserParLocalisationFournitureServicesNumeriques(
            reponse.activites
          );

        const prochaineEtape = versEtablissement
          ? 'localisationEtablissementPrincipal'
          : versServicesNumeriques
            ? 'localisationFournitureServicesNumeriques'
            : 'resultat';

        return {
          ...etat,
          etapeCourante: prochaineEtape,
          activites: reponse.activites,
        };
      });
      break;

    case 'VALIDE_ETAPE_LOCALISATION_ETABLISSEMENT_PRINCIPAL':
      update((etat) => {
        const prochaineEtape =
          doitPasserParLocalisationFournitureServicesNumeriques(etat.activites)
            ? 'localisationFournitureServicesNumeriques'
            : 'resultat';

        return {
          ...etat,
          etapeCourante: prochaineEtape,
          paysDecisionsCyber: reponse.paysDecision,
          paysOperationsCyber: reponse.paysOperation,
          paysPlusGrandNombreSalaries: reponse.paysSalaries,
        };
      });
      break;

    case 'VALIDE_ETAPE_LOCALISATION_SERVICES_NUMERIQUES':
      update((etat) => ({
        ...etat,
        etapeCourante: 'resultat',
        localisationFournitureServicesNumeriques: reponse.pays,
      }));
      break;
  }
};

export const questionnaireStore = { subscribe, repond, reset, set };
