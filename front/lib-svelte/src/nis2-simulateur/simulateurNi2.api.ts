import axios from 'axios';

type Reponses = {
  question1: boolean;
};

export const envoyerReponses = async (reponses: Reponses) => {
  await axios.post('/api/simulateur-nis2', reponses)
};
