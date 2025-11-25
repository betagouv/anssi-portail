import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc';
import { Guide } from '../../../src/metier/guide';
import { EntrepotGuideMemoire } from '../../persistance/entrepotGuideMemoire';
import { configurationDeTestDuServeur } from '../fauxObjets';
import { guideDevsecops, guideZeroTrust } from '../objetsPretsALEmploi';

describe('La ressource des guides de mêmes collections', () => {
  describe("sur demande d'un GET", () => {
    let entrepotGuide: EntrepotGuideMemoire;
    let serveur: Express;
    beforeEach(async () => {
      entrepotGuide = new EntrepotGuideMemoire();
      await entrepotGuide.ajoute(guideZeroTrust);
      await entrepotGuide.ajoute(guideDevsecops);
      await entrepotGuide.ajoute(new Guide({
        id: 'guide-sans-collection',
        nom: 'Guide sans collection',
        resume: '',
        description: '',
        nomImage: '',
        langue: 'FR',
        collections: [],
        documents: [],
        dateMiseAJour: '',
        datePublication: '',
      }));
      serveur = creeServeur({ ...configurationDeTestDuServeur, entrepotGuide });
    });
    it('répond 200', async () => {
      const reponse = await request(serveur).get(
        '/api/guides/zero-trust/memes-collections'
      );

      assert.equal(reponse.status, 200);
    });

    it("répond 404 si le guide n'existe pas", async () => {
      const reponse = await request(serveur).get(
        '/api/guides/slug-de-guide-inconnu/memes-collections'
      );

      assert.equal(reponse.status, 404);
    });

    it('renvoie une liste de guides dont les collections correspondent à au moins une collection du guide ciblé', async () => {
      const reponse = await request(serveur).get(
        '/api/guides/zero-trust/memes-collections'
      );

      assert.equal(reponse.body.length, 1);
      assert.equal(reponse.body[0].id, 'devsecops');
    });

    it("renvoie une liste vide si le guide ciblé n'a pas de collection", async () => {
      const reponse = await request(serveur).get(
        '/api/guides/guide-sans-collection/memes-collections'
      );

      assert.equal(reponse.body.length, 0);
    });
  });
});
