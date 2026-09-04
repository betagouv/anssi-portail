import axios from 'axios';

export const publieRéponseQuestionnaireVraiFaux = async (réponse: {
  idCorrélation: string;
  idQuestion: string;
  réponseUtilisateur: boolean;
}): Promise<void> => {
  await axios.post('/api/mini-tests/vrai-faux/reponses', réponse);
};
