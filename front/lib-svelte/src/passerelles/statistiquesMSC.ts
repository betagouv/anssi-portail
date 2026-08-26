import axios from 'axios';

export type Statistiques = {
  utilisateursInscrits: number;
  testsMaturite: {
    total: number;
    parNiveau: {
      insuffisant: number;
      emergent: number;
      intermediaire: number;
      confirme: number;
      optimal: number;
    };
  };
  diagnosticsCyber: number;
};

export const récupèreStatistiquesMSC = async (): Promise<Statistiques> => {
  const réponse = await axios.get<Statistiques>(`/api/statistiques`);
  return réponse.data;
};
