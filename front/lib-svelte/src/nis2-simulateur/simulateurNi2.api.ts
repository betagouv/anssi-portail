type Reponses = {
  question1: boolean;
};

export const envoyerReponses = async (reponses: Reponses) => {
  console.log('POST /api/simulateur-nis2', reponses);
};
