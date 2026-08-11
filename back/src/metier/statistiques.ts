import { EntrepotResultatTest } from './entrepotResultatTest.js';
import { EntrepotUtilisateur } from './entrepotUtilisateur.js';
import { IdNiveauMaturite } from './resultatTestMaturite.js';

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
  servicesEtRessourcesConsultes: number;
};

const SERVICES_ET_RESSOURCES_CONSULTES = 127000;
const NOMBRES_DE_DIAGNOSTIC_CYBER = 6516;

export const calculeStatistiques = async ({
  entrepotUtilisateur,
  entrepotResultatTest,
}: {
  entrepotUtilisateur: EntrepotUtilisateur;
  entrepotResultatTest: EntrepotResultatTest;
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
  return {
    utilisateursInscrits: await entrepotUtilisateur.taille(),
    servicesEtRessourcesConsultes: SERVICES_ET_RESSOURCES_CONSULTES,
    testsMaturite: {
      total: await entrepotResultatTest.taille(),
      parNiveau,
    },
    diagnosticsCyber: NOMBRES_DE_DIAGNOSTIC_CYBER,
  };
};
