import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc';
import { AdaptateurCellar, CleDuBucket, DocumentCellar } from '../../../src/infra/adaptateurCellar';
import { EntrepotUtilisateur } from '../../../src/metier/entrepotUtilisateur';
import { EntrepotGestionGuideMemoire } from '../../persistance/entrepotGestionGuideMemoire';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire';
import { encodeSession } from '../cookie';
import { configurationDeTestDuServeur, fauxAdaptateurCellar } from '../fauxObjets';
import { guideZeroTrust, hectorDurant, jeanneDupont } from '../objetsPretsALEmploi';

describe('La ressource de gestion des documents des guides', () => {
  let serveur: Express;
  let entrepotGestionGuide: EntrepotGestionGuideMemoire;
  let entrepotUtilisateur: EntrepotUtilisateur;
  let adaptateurCellar: AdaptateurCellar;
  let cookieJeanneDupont: string;

  beforeEach(async () => {
    entrepotGestionGuide = new EntrepotGestionGuideMemoire();
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    adaptateurCellar = {
      ...fauxAdaptateurCellar,
      depose: async () => undefined,
    };
    cookieJeanneDupont = encodeSession({
      email: jeanneDupont.email,
      token: 'token',
    });
    await entrepotUtilisateur.ajoute(jeanneDupont);
    await entrepotUtilisateur.ajoute(hectorDurant);
    await entrepotGestionGuide.ajoute(guideZeroTrust());
    await entrepotGestionGuide.ajoute(guideZeroTrust());
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      cellar: adaptateurCellar,
      entrepotGestionGuide,
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
      let cleDuBucketFournie = '';
      adaptateurCellar.depose = async (document: DocumentCellar, cleDuBucket: CleDuBucket) => {
        fichierDepose = document;
        cleDuBucketFournie = cleDuBucket;
      };

      await request(serveur)
        .post('/api/guides/zero-trust/documents')
        .set('Cookie', [cookieJeanneDupont])
        .field('libelleDuLien', 'Cliquez pour télécharger le document')
        .attach('document-guide', Buffer.from('une-texte'), 'document.pdf');

      assert.equal(fichierDepose.contenu.length, 9);
      assert.equal(fichierDepose.nom, 'document.pdf');
      assert.equal(fichierDepose.typeDeContenu, 'application/pdf');
      assert.equal(cleDuBucketFournie, 'GESTION_GUIDES');
    });

    it('ajoute le document dans Grist', async () => {
      let idGuidePourLequelLeDocumentEstAjoute = '';
      let nomDocumentAjoute = '';
      let libelleDuLienAjoute = '';
      entrepotGestionGuide.ajouteDocument = async (idGuide: string, nomDocument: string, libelleDuLien: string) => {
        idGuidePourLequelLeDocumentEstAjoute = idGuide;
        nomDocumentAjoute = nomDocument;
        libelleDuLienAjoute = libelleDuLien;
      };

      await request(serveur)
        .post('/api/guides/zero-trust/documents')
        .set('Cookie', [cookieJeanneDupont])
        .field('libelleDuLien', 'Cliquez pour télécharger le document')
        .attach('document-guide', Buffer.from('une-texte'), 'document.pdf');

      assert.equal(idGuidePourLequelLeDocumentEstAjoute, 'zero-trust');
      assert.equal(nomDocumentAjoute, 'document.pdf');
      assert.equal(libelleDuLienAjoute, 'Cliquez pour télécharger le document');
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
