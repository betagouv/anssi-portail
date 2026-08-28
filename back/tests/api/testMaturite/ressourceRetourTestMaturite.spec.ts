import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc.js';
import { RetourTestMaturitéDonné } from '../../../src/bus/evenements/retourTestMaturiteDonne.js';
import { AdaptateurEnvironnement } from '../../../src/infra/adaptateurEnvironnement.js';
import { fabriqueBusPourLesTests, MockBusEvenement } from '../../bus/busPourLesTests.js';
import { configurationDeTestDuServeur, fauxAdaptateurEnvironnement } from '../fauxObjets.js';

describe('La ressource retour sur les tests de maturité', () => {
  describe('sur requête POST', () => {
    let serveur: Express;
    let adaptateurEnvironnement: AdaptateurEnvironnement;
    let busEvenements: MockBusEvenement;

    const retourPositif = {
      retour: 'POSITIF',
    };

    beforeEach(async () => {
      adaptateurEnvironnement = {
        ...fauxAdaptateurEnvironnement,
      };
      busEvenements = fabriqueBusPourLesTests();
      serveur = creeServeur({
        ...configurationDeTestDuServeur,
        adaptateurEnvironnement,
        busEvenements,
      });
    });

    it('doit répondre 201', async () => {
      const reponse = await request(serveur).post('/api/retour-test-maturite').send(retourPositif);

      assert.equal(reponse.status, HttpStatusCode.Created);
    });

    it('doit répondre 400 si le corps de la requête est vide', async () => {
      const reponse = await request(serveur).post('/api/retour-test-maturite').send({});

      assert.equal(reponse.status, HttpStatusCode.BadRequest);
      assert.equal(reponse.body.fieldErrors.retour[0], 'Le retour doit être "POSITIF" ou "NEGATIF"');
    });

    it("doit répondre 400 si le retour n'est pas valide", async () => {
      const reponse = await request(serveur).post('/api/retour-test-maturite').send({ retour: 'INVALIDE' });

      assert.equal(reponse.status, HttpStatusCode.BadRequest);
      assert.equal(reponse.body.fieldErrors.retour[0], 'Le retour doit être "POSITIF" ou "NEGATIF"');
    });

    it('doit répondre 400 si le commentaire est trop long', async () => {
      const reponse = await request(serveur)
        .post('/api/retour-test-maturite')
        .send({ retour: 'NEGATIF', commentaire: 'x'.repeat(1001) });

      assert.equal(reponse.status, HttpStatusCode.BadRequest);
      assert.equal(reponse.body.fieldErrors.commentaire[0], 'Le commentaire doit contenir au plus 1000 caractères');
    });

    describe('concernant les retours positifs', () => {
      it('publie un événement', async () => {
        await request(serveur).post('/api/retour-test-maturite').send(retourPositif);

        busEvenements.aRecuUnEvenement(RetourTestMaturitéDonné);
        const evenement = busEvenements.recupereEvenement(RetourTestMaturitéDonné);
        assert.equal(evenement!.retour, 'POSITIF');
      });

      it('publie un événement sans commentaire', async () => {
        await request(serveur)
          .post('/api/retour-test-maturite')
          .send({ retour: 'POSITIF', commentaire: 'Ce test est sympa !' });

        busEvenements.aRecuUnEvenement(RetourTestMaturitéDonné);
        const evenement = busEvenements.recupereEvenement(RetourTestMaturitéDonné);
        assert.equal(evenement!.retour, 'POSITIF');
        assert.equal(evenement!.commentaire, undefined);
      });
    });

    describe('concernant les retours négatifs', () => {
      it('publie un événement avec commentaire', async () => {
        await request(serveur)
          .post('/api/retour-test-maturite')
          .send({ retour: 'NEGATIF', commentaire: 'Ce test est nul !' });

        busEvenements.aRecuUnEvenement(RetourTestMaturitéDonné);
        const evenement = busEvenements.recupereEvenement(RetourTestMaturitéDonné);
        assert.equal(evenement!.retour, 'NEGATIF');
        assert.equal(evenement!.commentaire, 'Ce test est nul !');
      });
    });
  });
});
