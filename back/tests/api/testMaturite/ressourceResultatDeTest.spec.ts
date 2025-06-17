import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { Express } from 'express';
import { EntrepotResultatTestMemoire } from '../../persistance/entrepotResultatTestMemoire';
import { configurationDeTestDuServeur } from '../fauxObjets';
import { creeServeur } from '../../../src/api/msc';
import { ResultatTestMaturite } from '../../../src/metier/resultatTestMaturite';
import { encodeSession } from '../cookie';
import assert from 'node:assert';
import { CodeRegion } from '../../../src/metier/referentielRegions';
import { CodeSecteur } from '../../../src/metier/referentielSecteurs';
import { CodeTrancheEffectif } from '../../../src/metier/referentielTranchesEffectifEtablissement';
import { ProprieteTestRevendiquee } from '../../../src/bus/evenements/proprieteTestRevendiquee';
import {
  fabriqueBusPourLesTests,
  MockBusEvenement,
} from '../../bus/busPourLesTests';
import { hectorDurant, jeanneDupont } from '../objetsPretsALEmploi';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire';

describe('La ressource qui gère un résultat de test', () => {
  let serveur: Express;
  let entrepotResultatTest: EntrepotResultatTestMemoire;
  let cookieJeanneDupont: string;
  let busEvenements: MockBusEvenement;

  beforeEach(async () => {
    entrepotResultatTest = new EntrepotResultatTestMemoire();
    const entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    await entrepotUtilisateur.ajoute(jeanneDupont);
    cookieJeanneDupont = encodeSession({
      email: jeanneDupont.email,
      token: 'token',
    });
    busEvenements = fabriqueBusPourLesTests();
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepotResultatTest,
      busEvenements,
      entrepotUtilisateur,
    });
  });

  const donneesResultatTestCorrectes = () => ({
    utilisateur: undefined,
    region: 'FR-NOR' as CodeRegion,
    secteur: 'J' as CodeSecteur,
    tailleOrganisation: '51' as CodeTrancheEffectif,
    reponses: {
      'prise-en-compte-risque': 2,
      pilotage: 3,
      budget: 5,
      'ressources-humaines': 3,
      'adoption-solutions': 2,
      posture: 3,
    },
  });

  describe('sur requête PUT', () => {
    it('refuse la mise à jour si le résultat de test a déjà été revendiqué par un autre utilisateur', async () => {
      await entrepotResultatTest.ajoute(
        new ResultatTestMaturite({
          ...donneesResultatTestCorrectes(),
          id: 'r1',
          utilisateur: hectorDurant,
        })
      );

      const reponse = await request(serveur)
        .put('/api/resultats-test/r1')
        .set('Cookie', [cookieJeanneDupont])
        .send();

      assert.equal(reponse.status, 403);
      const resultatTest = await entrepotResultatTest.parId('r1');
      assert.equal(resultatTest!.utilisateur, hectorDurant);
      busEvenements.naPasRecuDEvenement(ProprieteTestRevendiquee);
    });

    it('ne fait rien si le résultat a déjà été revendiqué par cet utilisateur', async () => {
      await entrepotResultatTest.ajoute(
        new ResultatTestMaturite({
          ...donneesResultatTestCorrectes(),
          utilisateur: jeanneDupont,
          id: 'r1',
        })
      );

      const reponse = await request(serveur)
        .put('/api/resultats-test/r1')
        .set('Cookie', [cookieJeanneDupont])
        .send();

      assert.equal(reponse.status, 200);
      busEvenements.naPasRecuDEvenement(ProprieteTestRevendiquee);
    });

    it("associe l'utilisateur courant au résultat de test", async () => {
      await entrepotResultatTest.ajoute(
        new ResultatTestMaturite({
          ...donneesResultatTestCorrectes(),
          id: 'r1',
        })
      );

      const reponse = await request(serveur)
        .put('/api/resultats-test/r1')
        .set('Cookie', [cookieJeanneDupont])
        .send();

      assert.equal(reponse.status, 200);
      const resultatTest = await entrepotResultatTest.parId('r1');
      assert.equal(resultatTest!.utilisateur, jeanneDupont);
    });

    it("renvoie une erreur 404 lorsque le résultat de test n'existe pas", async () => {
      const reponse = await request(serveur)
        .put('/api/resultats-test/r1')
        .set('Cookie', [cookieJeanneDupont])
        .send();

      assert.equal(reponse.status, 404);
    });

    it('publie un événement de revendication de propriété du test', async () => {
      await entrepotResultatTest.ajoute(
        new ResultatTestMaturite({
          ...donneesResultatTestCorrectes(),
          id: 'r1',
        })
      );

      await request(serveur)
        .put('/api/resultats-test/r1')
        .set('Cookie', [cookieJeanneDupont])
        .send();

      busEvenements.aRecuUnEvenement(ProprieteTestRevendiquee);
      const evenement = busEvenements.recupereEvenement(
        ProprieteTestRevendiquee
      );
      assert.equal(evenement!.utilisateur, jeanneDupont);
      assert.equal(evenement!.idResultatTest, 'r1');
    });

    it('refuse les requêtes non connectées', async () => {
      const reponse = await request(serveur)
        .put('/api/resultats-test/r1')
        .set('Cookie', [])
        .send();

      assert.equal(reponse.status, 401);
    });
  });
});
