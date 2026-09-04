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
  satisfactionUtilisateur: number;
  miniTests: {
    vraiFaux: number;
  };
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
  testsRéalisés: number;
};

export const récupèreStatistiquesMSC = async (): Promise<Statistiques> => {
  const réponse = await axios.get<APIStatistiques>(`/api/statistiques`);
  const { utilisateursInscrits, testsMaturite, diagnosticsCyber, satisfactionUtilisateur, miniTests } = réponse.data;
  const diagnosticsCyberArrondis = Math.floor(diagnosticsCyber / 100) * 100;
  const testsRéalisés = miniTests.vraiFaux + testsMaturite.total;
  return {
    diagnosticsCyber,
    diagnosticsCyberArrondis,
    satisfactionUtilisateur,
    testsRéalisés,
    testsMaturite,
    utilisateursInscrits,
  };
};
