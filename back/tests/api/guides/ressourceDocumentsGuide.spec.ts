import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc';
import { configurationDeTestDuServeur } from '../fauxObjets';

describe('La ressource de gestion des documents des guides', () => {
  let serveur: Express;

  beforeEach(() => {
    serveur = creeServeur(configurationDeTestDuServeur);
  });

  describe('sur un POST', () => {
    it('Répond 201', async () => {
      const reponse = await request(serveur)
        .post('/api/guides/zero-trust/documents')
        .attach('document-guide', Buffer.from('une-texte'), 'document.pdf');

      assert.equal(reponse.status, 201);
    });

    describe('avec un corps de requête', () => {
      it('rejette les requêtes sans fichier', async () => {
        const reponse = await request(serveur).post('/api/guides/zero-trust/documents');

        assert.equal(reponse.status, 400);
      });
    });
  });
});
