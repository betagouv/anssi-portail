import { AdaptateurStatistiqueParcours } from './adaptateurStatistiqueParcours.js';
import { EntrepotUtilisateur } from './entrepotUtilisateur.js';
import { AdaptateurStatistiqueMiniTests } from './mini-tests/adaptateurStatistiqueMiniTests.js';
import { EntrepôtRésultatTestMaturité } from './mini-tests/maturite-cyber/entrepotResultatTestMaturite.js';
import { IdNiveauMaturite } from './mini-tests/maturite-cyber/resultatTestMaturite.js';

/* Il faut modifier ces deux valeurs en même temps */
export const NOMBRES_DE_DIAGNOSTIC_CYBER = 7280;
export const DATE_MAJ_NOMBRES_DE_DIAGNOSTIC_CYBER = new Date('2026-11-09');

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
    exposition: number;
    reflexesCyber: number;
    hameconnage: number;
  };
  parcoursSécurisation: {
    nombreDémarrés: number;
  };
};

export const calculeStatistiques = async ({
  adaptateurStatistiqueMiniTests,
  adaptateurStatistiqueParcours,
  entrepôtRésultatTestMaturité,
  entrepotUtilisateur,
}: {
  adaptateurStatistiqueMiniTests: AdaptateurStatistiqueMiniTests;
  adaptateurStatistiqueParcours: AdaptateurStatistiqueParcours;
  entrepôtRésultatTestMaturité: EntrepôtRésultatTestMaturité;
  entrepotUtilisateur: EntrepotUtilisateur;
}): Promise<Statistiques> => {
  const tousLesTests = await entrepôtRésultatTestMaturité.tousEnOmettantUtilisateur();
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
  const miniTests = await adaptateurStatistiqueMiniTests.nombreDeMiniTestsRéalisés();
  const nombreDeParcoursDémarrés = await adaptateurStatistiqueParcours.nombreDeParcoursDémarrés();
  return {
    utilisateursInscrits: await entrepotUtilisateur.taille(),
    testsMaturite: {
      total: await entrepôtRésultatTestMaturité.taille(),
      parNiveau,
    },
    diagnosticsCyber: NOMBRES_DE_DIAGNOSTIC_CYBER,
    satisfactionUtilisateur: SATISFACTION_UTILISATEUR,
    miniTests,
    parcoursSécurisation: {
      nombreDémarrés: nombreDeParcoursDémarrés,
    },
  };
};
