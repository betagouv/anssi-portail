import axios from 'axios';
import type { FacteurAggravant, Secteur, TypeOrganisation } from '../../mini-tests/exposition/expositionCyberattaques';

export const publieRéponseQuestionnaireVraiFaux = async (
  réponse: {
    idCorrélation: string;
    idQuestion: string;
    réponseUtilisateur: boolean;
  },
  options?: { urlBase?: string }
): Promise<void> => {
  await axios.post(`${options?.urlBase ?? ''}/api/mini-tests/vrai-faux/reponses`, réponse);
};

export const publieRéponseQuestionnaireExposition = async (
  réponse: {
    typeOrganisation: TypeOrganisation;
    secteur?: Secteur;
    facteursAggravant: FacteurAggravant[];
  },
  options?: { urlBase?: string }
): Promise<void> => {
  await axios.post(`${options?.urlBase ?? ''}/api/mini-tests/exposition/tests`, réponse);
};

export const publieRéponseTestHameçonnage = async (
  réponse: {
    idCorrélation: string;
    idMail: string;
    réponse: 'bonne' | 'mauvaise';
    numéroRéponse: number;
  },
  options?: { urlBase?: string }
): Promise<void> => {
  await axios.post(`${options?.urlBase ?? ''}/api/mini-tests/hameconnage/reponses`, réponse);
};
