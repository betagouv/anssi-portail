import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../../src/api/msc.js';
import { RetourMiniTestDonné } from '../../../src/bus/evenements/retourMiniTestDonne.js';
import { AdaptateurEnvironnement } from '../../../src/infra/adaptateurEnvironnement.js';
import { fabriqueBusPourLesTests, MockBusEvenement } from '../../bus/busPourLesTests.js';
import { configurationDeTestDuServeur, fauxAdaptateurEnvironnement } from '../fauxObjets.js';

describe('La ressource retour sur les mini-tests', () => {
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

    it('doit répondre 201 pour le mini-test de maturité', async () => {
      const reponse = await request(serveur).post('/api/retour-mini-tests/test-maturité').send(retourPositif);

      expect(reponse.status).toBe(HttpStatusCode.Created);
    });

    it('doit répondre 201 pour le mini-test vrai-faux', async () => {
      const reponse = await request(serveur).post('/api/retour-mini-tests/vrai-faux').send(retourPositif);

      expect(reponse.status).toBe(HttpStatusCode.Created);
    });

    it('doit répondre 400 si le corps de la requête est vide', async () => {
      const reponse = await request(serveur).post('/api/retour-mini-tests/test-maturité').send({});

      expect(reponse.status).toBe(HttpStatusCode.BadRequest);
      expect(reponse.body.fieldErrors.retour[0]).toBe('Le retour doit être "POSITIF" ou "NEGATIF"');
    });

    it("doit répondre 400 si le retour n'est pas valide", async () => {
      const reponse = await request(serveur).post('/api/retour-mini-tests/test-maturité').send({ retour: 'INVALIDE' });

      expect(reponse.status).toBe(HttpStatusCode.BadRequest);
      expect(reponse.body.fieldErrors.retour[0]).toBe('Le retour doit être "POSITIF" ou "NEGATIF"');
    });

    it('doit répondre 400 si le commentaire est trop long', async () => {
      const reponse = await request(serveur)
        .post('/api/retour-mini-tests/test-maturité')
        .send({ retour: 'NEGATIF', commentaire: 'x'.repeat(1001) });

      expect(reponse.status).toBe(HttpStatusCode.BadRequest);
      expect(reponse.body.fieldErrors.commentaire[0]).toBe('Le commentaire doit contenir au plus 1000 caractères');
    });

    it('doit répondre 404 si le mini-test est inconnu', async () => {
      const reponse = await request(serveur).post('/api/retour-mini-tests/inconnu').send(retourPositif);

      expect(reponse.status).toBe(HttpStatusCode.NotFound);
    });

    describe('concernant les retours positifs', () => {
      it('publie un événement', async () => {
        await request(serveur).post('/api/retour-mini-tests/test-maturité').send(retourPositif);

        busEvenements.aRecuUnEvenement(RetourMiniTestDonné);
        const evenement = busEvenements.recupereEvenement(RetourMiniTestDonné);
        expect(evenement!.retour).toBe('POSITIF');
      });

      it('publie un événement sans commentaire', async () => {
        await request(serveur)
          .post('/api/retour-mini-tests/test-maturité')
          .send({ retour: 'POSITIF', commentaire: 'Ce test est sympa !' });

        busEvenements.aRecuUnEvenement(RetourMiniTestDonné);
        const evenement = busEvenements.recupereEvenement(RetourMiniTestDonné);
        expect(evenement!.retour).toBe('POSITIF');
        expect(evenement!.commentaire).toBeUndefined();
      });
    });

    describe('concernant les retours négatifs', () => {
      it('publie un événement avec commentaire', async () => {
        await request(serveur)
          .post('/api/retour-mini-tests/test-maturité')
          .send({ retour: 'NEGATIF', commentaire: 'Ce test est nul !' });

        busEvenements.aRecuUnEvenement(RetourMiniTestDonné);
        const evenement = busEvenements.recupereEvenement(RetourMiniTestDonné);
        expect(evenement!.retour).toBe('NEGATIF');
        expect(evenement!.commentaire).toBe('Ce test est nul !');
      });
    });
  });
});
