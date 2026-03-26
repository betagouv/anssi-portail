import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc';
import { EntrepotGuideMemoire } from '../../persistance/entrepotGuideMemoire';
import { configurationDeTestDuServeur } from '../fauxObjets';
import { guideZeroTrust } from '../objetsPretsALEmploi';

describe('La ressource de gestion des documents des guides', () => {
  let serveur: Express;
  let entrepotGuide: EntrepotGuideMemoire;

  beforeEach(async () => {
    entrepotGuide = new EntrepotGuideMemoire();
    await entrepotGuide.ajoute(guideZeroTrust());
    serveur = creeServeur({ ...configurationDeTestDuServeur, entrepotGuide });
  });

  describe('sur un POST', () => {
    it('Répond 201', async () => {
      const reponse = await request(serveur)
        .post('/api/guides/zero-trust/documents')
        .field('libelleDuLien', 'Cliquez pour télécharger le document')
        .attach('document-guide', Buffer.from('une-texte'), 'document.pdf');

      assert.equal(reponse.status, 201);
    });

    describe('avec un corps de requête', () => {
      it('rejette les requêtes sans fichier', async () => {
        const reponse = await request(serveur)
          .post('/api/guides/zero-trust/documents')
          .field('libelleDuLien', 'Cliquez pour télécharger le document');

        assert.equal(reponse.status, 400);
      });

      it('rejette les requêtes sans libelle de lien', async () => {
        const reponse = await request(serveur)
          .post('/api/guides/zero-trust/documents')
          .attach('document-guide', Buffer.from('une-texte'), 'document.pdf');

        assert.equal(reponse.status, 400);
      });
    });

    describe("avec un identifiant de guide qui n'existe pas", () => {
      it('rejette la requête', async () => {
        const reponse = await request(serveur)
          .post('/api/guides/guide-inexistant/documents')
          .field('libelleDuLien', 'Cliquez pour télécharger le document')
          .attach('document-guide', Buffer.from('une-texte'), 'document.pdf');

        assert.equal(reponse.status, 404);
        assert.equal(reponse.body.erreur, 'Le guide "guide-inexistant" est introuvable');
      });
    });
  });
});
