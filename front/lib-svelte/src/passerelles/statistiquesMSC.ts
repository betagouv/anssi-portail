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
    exposition: number;
    reflexesCyber: number;
  };
  parcoursSécurisation: {
    nombreDémarrés: number;
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
  diagnosticsCyberArrondis: number;
  satisfactionUtilisateur: number;
  testsRéalisés: number;
  démarchesDeSécurisation: number;
  démarchesDeSécurisationArrondies: number;
};

export const récupèreStatistiquesMSC = async (options?: { urlBase: string }): Promise<Statistiques> => {
  const réponse = await axios.get<APIStatistiques>(`${options?.urlBase ?? ''}/api/statistiques`);
  const {
    utilisateursInscrits,
    testsMaturite,
    diagnosticsCyber,
    satisfactionUtilisateur,
    miniTests,
    parcoursSécurisation,
  } = réponse.data;
  const diagnosticsCyberArrondis = Math.floor(diagnosticsCyber / 100) * 100;
  const testsRéalisés = miniTests.vraiFaux + testsMaturite.total + miniTests.exposition + miniTests.reflexesCyber;
  const démarchesDeSécurisation = diagnosticsCyber + parcoursSécurisation.nombreDémarrés;
  return {
    diagnosticsCyberArrondis,
    satisfactionUtilisateur,
    testsRéalisés,
    testsMaturite,
    utilisateursInscrits,
    démarchesDeSécurisation,
    démarchesDeSécurisationArrondies: Math.floor(démarchesDeSécurisation / 100) * 100,
  };
};
