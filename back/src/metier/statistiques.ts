import { AdaptateurMonAideCyber } from '../infra/adaptateurMonAideCyber';
import { EntrepotResultatTest } from './entrepotResultatTest';
import { EntrepotUtilisateur } from './entrepotUtilisateur';
import { IdNiveauMaturite } from './resultatTestMaturite';

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

const SERVICES_ET_RESSOURCES_CONSULTES = 4500;

export const calculeStatistiques = async ({
  entrepotUtilisateur,
  entrepotResultatTest,
  adaptateurMonAideCyber,
}: {
  entrepotUtilisateur: EntrepotUtilisateur;
  entrepotResultatTest: EntrepotResultatTest;
  adaptateurMonAideCyber: AdaptateurMonAideCyber;
}): Promise<Statistiques> => {
  const { nombreDiagnostics } = await adaptateurMonAideCyber.statistiques();
  const tousLesTests = await entrepotResultatTest.tousEnOmettantUtilisateur();
  const listeDesNiveaux: IdNiveauMaturite[] = tousLesTests.map((test) =>
    test.niveau()
  );
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
    diagnosticsCyber: nombreDiagnostics,
  };
};
