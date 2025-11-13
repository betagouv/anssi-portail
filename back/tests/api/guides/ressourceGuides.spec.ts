import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc';
import { configurationDeTestDuServeur } from '../fauxObjets';
import { EntrepotGuide } from '../../../src/metier/entrepotGuide';

describe('La ressource qui gère les guides', () => {
  let serveur: Express;
  let entrepotGuide: EntrepotGuide;

  beforeEach(() => {
    entrepotGuide = {
      tous: async () => [
        {
          id: 'guide1',
          lienVignette: 'http://localhost/vignette1',
          titre: 'Premier guide',
        },
        {
          id: 'guide2',
          lienVignette: 'http://localhost/vignette2',
          titre: 'Deuxième guide',
        },
      ],
    };
    serveur = creeServeur({ ...configurationDeTestDuServeur, entrepotGuide });
  });
  describe('sur requête GET', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/api/guides');

      assert.equal(reponse.status, 200);
    });

    it('renvoie la liste des guides', async () => {
      const reponse = await request(serveur).get('/api/guides');

      assert.equal(reponse.body.length, 2);
      assert.deepEqual(reponse.body[0], {
        id: 'guide1',
        lienVignette: 'http://localhost/vignette1',
        titre: 'Premier guide',
      });
      assert.deepEqual(reponse.body[1], {
        id: 'guide2',
        lienVignette: 'http://localhost/vignette2',
        titre: 'Deuxième guide',
      });
    });

    it("renvoie un 500 si l'entrepot renvoie une erreur", async () => {
      entrepotGuide.tous = () => {
        throw new Error('Erreur technique');
      };
      const reponse = await request(serveur).get('/api/guides');

      assert.equal(reponse.status, 500);
    });
  });
});
