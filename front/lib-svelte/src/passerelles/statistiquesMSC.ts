import axios from 'axios';

type APIStatistiques = {
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
  diagnosticsCyberArrondis: number;
  satisfactionUtilisateur: number;
};

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
  diagnosticsCyberArrondis: number;
  satisfactionUtilisateur: number;
};

export const récupèreStatistiquesMSC = async (): Promise<Statistiques> => {
  const réponse = await axios.get<APIStatistiques>(`/api/statistiques`);
  const diagnosticsCyberArrondis = Math.floor(réponse.data.diagnosticsCyber / 100) * 100;

  return {
    ...réponse.data,
    diagnosticsCyberArrondis,
  };
};
