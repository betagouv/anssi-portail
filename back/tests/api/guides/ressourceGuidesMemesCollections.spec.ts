import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import { beforeEach, describe, it, expect } from 'vitest';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc.js';
import { Guide } from '../../../src/metier/guide.js';
import { EntrepotGuideMemoire } from '../../persistance/entrepotGuideMemoire.js';
import { configurationDeTestDuServeur } from '../fauxObjets.js';
import { guideDevsecops, guideZeroTrust } from '../objetsPretsALEmploi.js';

describe('La ressource des guides de mêmes collections', () => {
  describe("sur demande d'un GET", () => {
    let entrepotGuide: EntrepotGuideMemoire;
    let serveur: Express;
    beforeEach(async () => {
      entrepotGuide = new EntrepotGuideMemoire();
      await entrepotGuide.ajoute(guideZeroTrust());
      await entrepotGuide.ajoute(guideDevsecops());
      await entrepotGuide.ajoute(
        new Guide({
          id: 'guide-sans-collection',
          nom: 'Guide sans collection',
          description: '',
          langue: 'FR',
          collections: [],
          listeDocuments: [],
          dateMiseAJour: new Date(),
          thematique: '',
          besoins: [],
        })
      );
      serveur = creeServeur({ ...configurationDeTestDuServeur, entrepotGuide });
    });
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/api/guides/zero-trust/memes-collections');

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it("répond 404 si le guide n'existe pas", async () => {
      const reponse = await request(serveur).get('/api/guides/slug-de-guide-inconnu/memes-collections');

      expect(reponse.status).toBe(HttpStatusCode.NotFound);
    });

    it('renvoie une liste de guides dont les collections correspondent à au moins une collection du guide ciblé', async () => {
      const reponse = await request(serveur).get('/api/guides/zero-trust/memes-collections');

      expect(reponse.body).toHaveLength(1);
      expect(reponse.body[0].id).toBe('devsecops');
    });

    it("renvoie une liste vide si le guide ciblé n'a pas de collection", async () => {
      const reponse = await request(serveur).get('/api/guides/guide-sans-collection/memes-collections');

      expect(reponse.body).toHaveLength(0);
    });
  });
});
