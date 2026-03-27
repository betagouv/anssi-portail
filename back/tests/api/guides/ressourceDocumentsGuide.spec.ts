import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc';
import { EntrepotUtilisateur } from '../../../src/metier/entrepotUtilisateur';
import { EntrepotGuideMemoire } from '../../persistance/entrepotGuideMemoire';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire';
import { encodeSession } from '../cookie';
import { configurationDeTestDuServeur } from '../fauxObjets';
import { guideZeroTrust, hectorDurant, jeanneDupont } from '../objetsPretsALEmploi';
import { AdaptateurCellar, DocumentCellar } from '../../../src/infra/adaptateurCellar';

describe('La ressource de gestion des documents des guides', () => {
  let serveur: Express;
  let entrepotGuide: EntrepotGuideMemoire;
  let entrepotUtilisateur: EntrepotUtilisateur;
  let adaptateurCellar: AdaptateurCellar;
  let cookieJeanneDupont: string;

  beforeEach(async () => {
    entrepotGuide = new EntrepotGuideMemoire();
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    adaptateurCellar = {
      existe: async () => true,
      get: async () => undefined,
      getStream: async () => undefined,
      depose: async () => undefined,
    };
    cookieJeanneDupont = encodeSession({
      email: jeanneDupont.email,
      token: 'token',
    });
    await entrepotUtilisateur.ajoute(jeanneDupont);
    await entrepotUtilisateur.ajoute(hectorDurant);
    await entrepotGuide.ajoute(guideZeroTrust());
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      cellar: adaptateurCellar,
      entrepotGuide,
      entrepotUtilisateur,
    });
  });

  describe('sur un POST', () => {
    it('répond 201', async () => {
      const reponse = await request(serveur)
        .post('/api/guides/zero-trust/documents')
        .set('Cookie', [cookieJeanneDupont])
        .field('libelleDuLien', 'Cliquez pour télécharger le document')
        .attach('document-guide', Buffer.from('une-texte'), 'document.pdf');

      assert.equal(reponse.status, 201);
    });

    it('ajoute un document dans Cellar', async () => {
      let fichierDepose: DocumentCellar = {
        nom: '',
        contenu: Buffer.from(''),
        typeDeContenu: '',
      };
      adaptateurCellar.depose = async (document: DocumentCellar) => {
        fichierDepose = document;
      };

      await request(serveur)
        .post('/api/guides/zero-trust/documents')
        .set('Cookie', [cookieJeanneDupont])
        .field('libelleDuLien', 'Cliquez pour télécharger le document')
        .attach('document-guide', Buffer.from('une-texte'), 'document.pdf');

      assert.equal(fichierDepose.contenu.length, 9);
      assert.equal(fichierDepose.nom, 'document.pdf');
      assert.equal(fichierDepose.typeDeContenu, 'application/pdf');
    });

    it('répond 401 si l’utilisateur n’est pas authentifié', async () => {
      const reponse = await request(serveur).post('/api/guides/zero-trust/documents');

      assert.equal(reponse.status, 401);
    });

    it("répond 403 si l’utilisateur n'a pas l'autorisation de gérer les guides", async () => {
      const cookieHectorDurant = encodeSession({
        email: hectorDurant.email,
        token: 'token',
      });

      const reponse = await request(serveur)
        .post('/api/guides/zero-trust/documents')
        .set('Cookie', [cookieHectorDurant])
        .field('libelleDuLien', 'Cliquez pour télécharger le document')
        .attach('document-guide', Buffer.from('une-texte'), 'document.pdf');

      assert.equal(reponse.status, 403);
    });

    describe('avec un corps de requête', () => {
      it('rejette les requêtes sans fichier', async () => {
        const reponse = await request(serveur)
          .post('/api/guides/zero-trust/documents')
          .set('Cookie', [cookieJeanneDupont])
          .field('libelleDuLien', 'Cliquez pour télécharger le document');

        assert.equal(reponse.status, 400);
      });

      it('rejette les requêtes sans libelle de lien', async () => {
        const reponse = await request(serveur)
          .post('/api/guides/zero-trust/documents')
          .set('Cookie', [cookieJeanneDupont])
          .attach('document-guide', Buffer.from('une-texte'), 'document.pdf');

        assert.equal(reponse.status, 400);
      });
    });

    describe("avec un identifiant de guide qui n'existe pas", () => {
      it('rejette la requête', async () => {
        const reponse = await request(serveur)
          .post('/api/guides/guide-inexistant/documents')
          .set('Cookie', [cookieJeanneDupont])
          .field('libelleDuLien', 'Cliquez pour télécharger le document')
          .attach('document-guide', Buffer.from('une-texte'), 'document.pdf');

        assert.equal(reponse.status, 404);
        assert.equal(reponse.body.erreur, 'Le guide "guide-inexistant" est introuvable');
      });
    });
  });
});
