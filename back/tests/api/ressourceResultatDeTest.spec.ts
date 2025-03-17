import { beforeEach, describe, it } from 'node:test';
import { Express } from 'express';
import { creeServeur } from '../../src/api/msc';
import { configurationDeTestDuServeur, fauxAdaptateurJWT } from './fauxObjets';
import request from 'supertest';
import assert from 'node:assert';
import {
  fabriqueBusPourLesTests,
  MockBusEvenement,
} from '../bus/busPourLesTests';
import { TestRealise } from '../../src/bus/testRealise';
import { AdaptateurJWT } from '../../src/api/adaptateurJWT';
import { EntrepotResultatTestMemoire } from '../persistance/entrepotResultatTestMemoire';
import { encodeSession } from './cookie';

const REGEX_UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe('La ressource qui gère les résultats de test de maturité', () => {
  let serveur: Express;
  let busEvenement: MockBusEvenement;
  let entrepotResultatTest: EntrepotResultatTestMemoire;
  let adaptateurJWT: AdaptateurJWT;

  const donneesCorrectes = {
    region: 'FR-NOR',
    secteur: 'J',
    tailleOrganisation: '51',
    reponses: {
      'prise-en-compte-risque': 2,
      pilotage: 3,
      budget: 5,
      'ressources-humaines': 3,
      'adoption-solutions': 2,
      posture: 3,
    },
  };

  beforeEach(() => {
    busEvenement = fabriqueBusPourLesTests();
    entrepotResultatTest = new EntrepotResultatTestMemoire();
    adaptateurJWT = { ...fauxAdaptateurJWT };
    adaptateurJWT.decode = (_) => ({ email: '' });
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      busEvenements: busEvenement,
      entrepotResultatTest,
      adaptateurJWT,
    });
  });

  describe('sur requête POST', () => {
    it('répond 201', async () => {
      const reponse = await request(serveur)
        .post('/api/resultats-test')
        .send(donneesCorrectes);

      assert.equal(reponse.status, 201);
    });

    it('publie un évènement du bus TestRealise', async () => {
      await request(serveur)
        .post('/api/resultats-test')
        .send({
          region: 'FR-NOR',
          secteur: 'J',
          tailleOrganisation: '51',
          reponses: {
            'prise-en-compte-risque': 2,
            pilotage: 3,
            budget: 5,
            'ressources-humaines': 3,
            'adoption-solutions': 2,
            posture: 3,
          },
        });

      busEvenement.aRecuUnEvenement(TestRealise);
      let evenement = busEvenement.recupereEvenement(TestRealise);
      assert.equal(evenement!.region, 'FR-NOR');
      assert.equal(evenement!.secteur, 'J');
      assert.equal(evenement!.tailleOrganisation, '51');
      assert.deepEqual(evenement!.reponses, {
        'prise-en-compte-risque': 2,
        pilotage: 3,
        budget: 5,
        'ressources-humaines': 3,
        'adoption-solutions': 2,
        posture: 3,
      });
    });

    describe("lorsque l'utilisateur est connecte", () => {
      let cookie: string;

      beforeEach(() => {
        cookie = encodeSession({ email: 'jeanne.dupont@mail.com' });
      });

      it("sauvegarde le résultat de test avec l'email de l'utilisateur", async () => {
        await request(serveur)
          .post('/api/resultats-test')
          .set('Cookie', [cookie])
          .send({
            region: 'FR-NOR',
            secteur: 'J',
            tailleOrganisation: '51',
            reponses: {
              'prise-en-compte-risque': 2,
              pilotage: 3,
              budget: 5,
              'ressources-humaines': 3,
              'adoption-solutions': 2,
              posture: 3,
            },
          });

        const resultatSauvegarde =
          await entrepotResultatTest.dernierPourUtilisateur(
            'jeanne.dupont@mail.com'
          );

        assert.notEqual(resultatSauvegarde, undefined);
        assert.equal(
          resultatSauvegarde?.emailUtilisateur,
          'jeanne.dupont@mail.com'
        );
        assert.equal(resultatSauvegarde!.region, 'FR-NOR');
        assert.equal(resultatSauvegarde!.secteur, 'J');
        assert.equal(resultatSauvegarde!.tailleOrganisation, '51');
        assert.deepEqual(resultatSauvegarde!.reponses, {
          'prise-en-compte-risque': 2,
          pilotage: 3,
          budget: 5,
          'ressources-humaines': 3,
          'adoption-solutions': 2,
          posture: 3,
        });
      });

      it("retourne l'identifiant du résultat de test", async () => {
        adaptateurJWT.decode = () => ({ email: 'jeanne.dupont@mail.com' });

        let reponse = await request(serveur)
          .post('/api/resultats-test')
          .set('Cookie', [cookie])
          .send(donneesCorrectes);

        const resultatSauvegarde =
          await entrepotResultatTest.dernierPourUtilisateur(
            'jeanne.dupont@mail.com'
          );
        assert.match(resultatSauvegarde!.id, REGEX_UUID);
        assert.deepEqual(reponse.body, { id: resultatSauvegarde!.id });
      });
    });

    describe("lorsque l'utilisateur n'est pas connecté", () => {
      it('sauvegarde le résultat du test sans email', async () => {
        await request(serveur)
          .post('/api/resultats-test')
          .send(donneesCorrectes);

        const resultatSauvegarde = (await entrepotResultatTest.tous())[0];
        assert.notEqual(resultatSauvegarde, undefined);
        assert.equal(resultatSauvegarde?.emailUtilisateur, undefined);
      });
    });

    describe('concernant la validation des données', () => {
      const requeteAvecDonneeIncorrecte = async (
        donnees: Record<string, any>
      ) => {
        const reponse = await request(serveur)
          .post('/api/resultats-test')
          .send({
            ...donneesCorrectes,
            ...donnees,
          });
        return reponse;
      };

      it('accepte une région non renseignée', async () => {
        const reponse = await requeteAvecDonneeIncorrecte({
          region: null,
        });

        assert.equal(reponse.status, 201);
        const evenement = busEvenement.recupereEvenement(TestRealise);
        assert.equal(evenement!.region, null);
      });

      it('accepte un secteur non renseigné', async () => {
        const reponse = await requeteAvecDonneeIncorrecte({
          secteur: null,
        });

        assert.equal(reponse.status, 201);
        const evenement = busEvenement.recupereEvenement(TestRealise);
        assert.equal(evenement!.secteur, null);
      });

      it("accepte une taille d'organisation non renseignée", async () => {
        const reponse = await requeteAvecDonneeIncorrecte({
          tailleOrganisation: null,
        });

        assert.equal(reponse.status, 201);
        const evenement = busEvenement.recupereEvenement(TestRealise);
        assert.equal(evenement!.tailleOrganisation, null);
      });

      it('valide la région', async () => {
        const reponse = await requeteAvecDonneeIncorrecte({
          region: 'UneRegionInconnue',
        });

        assert.equal(reponse.status, 400);
        assert.equal(reponse.body.erreur, 'Région invalide');
      });

      it('valide le secteur', async () => {
        const reponse = await requeteAvecDonneeIncorrecte({
          secteur: 'UnSecteurInconnu',
        });

        assert.equal(reponse.status, 400);
        assert.equal(reponse.body.erreur, 'Secteur invalide');
      });

      it("valide la taille d'organisation", async () => {
        const reponse = await requeteAvecDonneeIncorrecte({
          tailleOrganisation: 'UneTailleInconnue',
        });

        assert.equal(reponse.status, 400);
        assert.equal(reponse.body.erreur, "Taille d'organisation invalide");
      });

      describe('concernant les réponses', () => {
        it('valide que les réponses sont dans un objet', async () => {
          const reponse = await requeteAvecDonneeIncorrecte({
            reponses: ['pasUnObjet'],
          });

          assert.equal(reponse.status, 400);
          assert.equal(
            reponse.body.erreur,
            'Les réponses doivent être dans un objet'
          );
        });

        it('valide les clés de réponses', async () => {
          const reponse = await requeteAvecDonneeIncorrecte({
            reponses: { uneAutreClé: 1 },
          });

          assert.equal(reponse.status, 400);
          assert.equal(
            reponse.body.erreur,
            'Les clés de réponse sont invalides'
          );
        });

        it('valide les valeurs de reponses', async () => {
          const reponse = await requeteAvecDonneeIncorrecte({
            reponses: { ...donneesCorrectes.reponses, pilotage: 0 },
          });

          assert.equal(reponse.status, 400);
          assert.equal(
            reponse.body.erreur,
            'Les valeurs de réponses doivent être comprises entre 1 et 5'
          );
        });
      });
    });
  });
});
