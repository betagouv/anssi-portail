import axios from 'axios';
import type { EtatQuestionnaire } from '../../../../back/src/metier/nis2-simulateur/EtatQuestionnaire';

export const envoyerReponses = async (reponses: EtatQuestionnaire) => {
  await axios.post('/api/simulateur-nis2', reponses);
};
