import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../../src/api/msc/index.js';
import { RetourOutilDonné } from '../../../src/bus/evenements/retourOutilDonne.js';
import { AdaptateurEnvironnement } from '../../../src/infra/adaptateurEnvironnement.js';
import { fabriqueBusPourLesTests, MockBusEvenement } from '../../bus/busPourLesTests.js';
import { configurationDeTestDuServeur, fauxAdaptateurEnvironnement } from '../fauxObjets.js';

describe("La ressource qui gère les retours d'un outil", () => {
  const retourPositif = {
    retour: 'POSITIF',
  };

  let serveur: Express;
  let adaptateurEnvironnement: AdaptateurEnvironnement;
  let busEvenements: MockBusEvenement;

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
  describe('sur une requête GET', () => {
    it("réponds 201 pour le modèle d'annuaire de crise", async () => {
      const { status } = await request(serveur)
        .post(`/api/outils/retours/modele-annuaire-de-crise.xlsx`)
        .send(retourPositif);

      expect(status).toBe(HttpStatusCode.Created);
    });

    it("réponds 201 pour le rappel de mise à jour de l'annuaire de contacts", async () => {
      const { status } = await request(serveur)
        .post(`/api/outils/retours/rappel-mise-a-jour-annuaire-contacts.ics`)
        .send(retourPositif);

      expect(status).toBe(HttpStatusCode.Created);
    });

    it('doit répondre 400 si le corps de la requête est vide', async () => {
      const { body, status } = await request(serveur).post('/api/outils/retours/modele-annuaire-de-crise.xlsx').send();

      expect(status).toBe(HttpStatusCode.BadRequest);
      expect(body.fieldErrors.retour[0]).toBe('Le retour doit être "POSITIF" ou "NEGATIF"');
    });

    it("doit répondre 400 si le retour n'est pas valide", async () => {
      const { body, status } = await request(serveur)
        .post('/api/outils/retours/modele-annuaire-de-crise.xlsx')
        .send({ retour: 'INVALIDE' });

      expect(status).toBe(HttpStatusCode.BadRequest);
      expect(body.fieldErrors.retour[0]).toBe('Le retour doit être "POSITIF" ou "NEGATIF"');
    });

    it('doit répondre 400 si le commentaire est trop long', async () => {
      const { body, status } = await request(serveur)
        .post('/api/outils/retours/modele-annuaire-de-crise.xlsx')
        .send({ retour: 'NEGATIF', commentaire: 'x'.repeat(1001) });

      expect(status).toBe(HttpStatusCode.BadRequest);
      expect(body.fieldErrors.commentaire[0]).toBe('Le commentaire doit contenir au plus 1000 caractères');
    });

    it("doit répondre 404 si l'outil est inconnu", async () => {
      const reponse = await request(serveur).post('/api/outils/retours/outil-inconnu').send(retourPositif);

      expect(reponse.status).toBe(HttpStatusCode.NotFound);
    });

    describe('concernant les retours positifs', () => {
      it('publie un événement', async () => {
        await request(serveur).post('/api/outils/retours/modele-annuaire-de-crise.xlsx').send(retourPositif);

        busEvenements.aRecuUnEvenement(RetourOutilDonné);
        const evenement = busEvenements.recupereEvenement(RetourOutilDonné);
        expect(evenement!.retour).toBe('POSITIF');
      });

      it('publie un événement sans commentaire', async () => {
        await request(serveur)
          .post('/api/outils/retours/modele-annuaire-de-crise.xlsx')
          .send({ retour: 'POSITIF', commentaire: 'Ce test est sympa !' });

        busEvenements.aRecuUnEvenement(RetourOutilDonné);
        const evenement = busEvenements.recupereEvenement(RetourOutilDonné);
        expect(evenement!.retour).toBe('POSITIF');
        expect(evenement!.commentaire).toBeUndefined();
      });
    });

    describe('concernant les retours négatifs', () => {
      it('publie un événement avec commentaire', async () => {
        await request(serveur)
          .post('/api/outils/retours/modele-annuaire-de-crise.xlsx')
          .send({ retour: 'NEGATIF', commentaire: 'Ce test est nul !' });

        busEvenements.aRecuUnEvenement(RetourOutilDonné);
        const evenement = busEvenements.recupereEvenement(RetourOutilDonné);
        expect(evenement!.retour).toBe('NEGATIF');
        expect(evenement!.commentaire).toBe('Ce test est nul !');
      });
    });
  });
});
