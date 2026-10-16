import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../../src/api/msc/index.js';
import { configurationDeTestDuServeur } from '../fauxObjets.js';

describe("La ressource qui gère les retours d'un outil", () => {
  const retourPositif = {
    retour: 'POSITIF',
  };

  let serveur: Express;

  beforeEach(() => {
    serveur = creeServeur(configurationDeTestDuServeur);
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
  });
});
