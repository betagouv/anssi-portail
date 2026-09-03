import { AdaptateurStatistiqueMiniTests } from './adaptateurStatistiqueMiniTests.js';
import { EntrepotResultatTest } from './entrepotResultatTest.js';
import { EntrepotUtilisateur } from './entrepotUtilisateur.js';
import { IdNiveauMaturite } from './resultatTestMaturite.js';

const NOMBRES_DE_DIAGNOSTIC_CYBER = 6600;
const SATISFACTION_UTILISATEUR = 92;

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
  satisfactionUtilisateur: number;
  miniTests: {
    vraiFaux: number;
  };
};

export const calculeStatistiques = async ({
  adaptateurStatistique,
  entrepotResultatTest,
  entrepotUtilisateur,
}: {
  adaptateurStatistique: AdaptateurStatistiqueMiniTests;
  entrepotResultatTest: EntrepotResultatTest;
  entrepotUtilisateur: EntrepotUtilisateur;
}): Promise<Statistiques> => {
  const tousLesTests = await entrepotResultatTest.tousEnOmettantUtilisateur();
  const listeDesNiveaux: IdNiveauMaturite[] = tousLesTests.map((test) => test.niveau());
  const parNiveau = listeDesNiveaux.reduce(
    (accumulateur, niveau) => {
      if (niveau === 'insuffisant') {
        accumulateur.insuffisant++;
      }
      if (niveau === 'emergent') {
        accumulateur.emergent++;
      }
      if (niveau === 'intermediaire') {
        accumulateur.intermediaire++;
      }
      if (niveau === 'confirme') {
        accumulateur.confirme++;
      }
      if (niveau === 'optimal') {
        accumulateur.optimal++;
      }
      return accumulateur;
    },
    {
      insuffisant: 0,
      emergent: 0,
      intermediaire: 0,
      confirme: 0,
      optimal: 0,
    } as Statistiques['testsMaturite']['parNiveau']
  );
  const miniTests = await adaptateurStatistique.nombreDeMiniTestsRéalisés();
  return {
    utilisateursInscrits: await entrepotUtilisateur.taille(),
    testsMaturite: {
      total: await entrepotResultatTest.taille(),
      parNiveau,
    },
    diagnosticsCyber: NOMBRES_DE_DIAGNOSTIC_CYBER,
    satisfactionUtilisateur: SATISFACTION_UTILISATEUR,
    miniTests,
  };
};
