import axios from 'axios';
import type { TypeOrganisation, Secteur, FacteurAggravant } from '../../mini-tests/exposition/expositionCyberattaques';

export const publieRéponseQuestionnaireVraiFaux = async (réponse: {
  idCorrélation: string;
  idQuestion: string;
  réponseUtilisateur: boolean;
}): Promise<void> => {
  await axios.post('/api/mini-tests/vrai-faux/reponses', réponse);
};

export const publieRéponseQuestionnaireExposition = async (réponse: {
  typeOrganisation: TypeOrganisation;
  secteur?: Secteur;
  facteursAggravant: FacteurAggravant[];
}): Promise<void> => {
  await axios.post('/api/mini-tests/exposition/tests', réponse);
};
