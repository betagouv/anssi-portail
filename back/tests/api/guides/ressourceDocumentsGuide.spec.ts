import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc';
import { AdaptateurCellar, CleDuBucket, DocumentCellar } from '../../../src/infra/adaptateurCellar';
import { GenerateurImage } from '../../../src/infra/generateurImage';
import { EntrepotUtilisateur } from '../../../src/metier/entrepotUtilisateur';
import { Guide } from '../../../src/metier/guide';
import { EntrepotGuideTravailMemoire } from '../../persistance/entrepotGuideTravailMemoire';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire';
import { encodeSession } from '../cookie';
import { configurationDeTestDuServeur, fauxAdaptateurCellar } from '../fauxObjets';
import * as fabrique from '../objetsPretsALEmploi';
import { guideDevsecops, hectorDurant, jeanneDupont } from '../objetsPretsALEmploi';

describe('La ressource de gestion des documents des guides', () => {
  let serveur: Express;
  let entrepotGuideTravail: EntrepotGuideTravailMemoire;
  let entrepotUtilisateur: EntrepotUtilisateur;
  let adaptateurCellar: AdaptateurCellar;
  let generateurImage: GenerateurImage;
  let cookieJeanneDupont: string;
  let guideZeroTrust: Guide;

  beforeEach(async () => {
    entrepotGuideTravail = new EntrepotGuideTravailMemoire();
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    generateurImage = {
      depuisPdf: async (pdfOriginal) => {
        return pdfOriginal;
      },
    };
    adaptateurCellar = {
      ...fauxAdaptateurCellar,
      depose: async () => undefined,
      supprime: async () => undefined,
    };
    cookieJeanneDupont = encodeSession({
      email: jeanneDupont.email,
      token: 'token',
    });
    await entrepotUtilisateur.ajoute(jeanneDupont);
    await entrepotUtilisateur.ajoute(hectorDurant);
    guideZeroTrust = fabrique.guideZeroTrust();
    await entrepotGuideTravail.ajoute(guideZeroTrust);
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      cellar: adaptateurCellar,
      entrepotGuideTravail: entrepotGuideTravail,
      entrepotUtilisateur,
      generateurImage,
    });
  });

  describe('sur un POST', () => {
    it('répond 201', async () => {
      const reponse = await request(serveur)
        .post('/api/guides/zero-trust/documents')
        .set('Cookie', [cookieJeanneDupont])
        .field('libelleDuLien', 'Cliquez pour télécharger le document')
        .attach('document-guide', Buffer.from('un-texte'), 'document.pdf');

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
        .attach('document-guide', Buffer.from('un-texte'), 'document.pdf');

      assert.equal(fichierDepose.contenu.length, 8);
      assert.equal(fichierDepose.nom, 'document.pdf');
      assert.equal(fichierDepose.typeDeContenu, 'application/pdf');
      assert.equal(cleDuBucketFournie, 'GESTION_GUIDES');
    });

    it('ajoute le document dans Grist', async () => {
      await request(serveur)
        .post('/api/guides/zero-trust/documents')
        .set('Cookie', [cookieJeanneDupont])
        .field('libelleDuLien', 'Cliquez pour télécharger le document')
        .attach('document-guide', Buffer.from('un-texte'), 'document.pdf');

      const monGuide = await entrepotGuideTravail.parId('zero-trust');
      assert.equal(monGuide?.listeDocuments.length, 1);
      assert.equal(monGuide?.listeDocuments[0].libelle, 'Cliquez pour télécharger le document');
      assert.equal(monGuide?.listeDocuments[0].nomFichier, 'document.pdf');
    });

    it('génère les illustrations et les dépose', async () => {
      const fichiersDeposes: DocumentCellar[] = [];
      const fichiersFournis: Buffer[] = [];
      adaptateurCellar.depose = async (document: DocumentCellar) => {
        fichiersDeposes.push(document);
      };
      generateurImage.depuisPdf = async (fichier) => {
        fichiersFournis.push(fichier);
        return fichier;
      };

      await request(serveur)
        .post('/api/guides/zero-trust/documents')
        .set('Cookie', [cookieJeanneDupont])
        .field('libelleDuLien', 'Cliquez pour télécharger le document')
        .field('genereVisuel', true)
        .attach('document-guide', Buffer.from('un-texte'), 'document.pdf');

      assert.equal(fichiersDeposes.length, 3);
      assert.equal(fichiersDeposes[0].nom, 'document.pdf');
      assert.equal(fichiersDeposes[1].nom, 'zero-trust/origine.avif');
      assert.equal(fichiersDeposes[2].nom, 'zero-trust/588.avif');
      assert.equal(fichiersFournis.length, 2);
      assert.equal(fichiersFournis[0].length, 8);
      assert.equal(fichiersFournis[1].length, 8);
    });

    it('répond 400 si un fichier de même nom existe déjà pour ce guide', async () => {
      const guide = guideDevsecops();
      guide.listeDocuments = [
        {
          libelle: 'Les Essentiels de l&#039;ANSSI - DevSecOps - v1.0',
          nomFichier: 'anssi_essentiels_devsecops_v1.0.pdf',
        },
      ];
      await entrepotGuideTravail.ajoute(guide);

      const reponse = await request(serveur)
        .post('/api/guides/devsecops/documents')
        .set('Cookie', [cookieJeanneDupont])
        .field('libelleDuLien', 'Cliquez pour télécharger le document')
        .attach('document-guide', Buffer.from('un-texte'), 'anssi_essentiels_devsecops_v1.0.pdf');

      assert.equal(reponse.status, 400);
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
        .attach('document-guide', Buffer.from('un-texte'), 'document.pdf');

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
          .attach('document-guide', Buffer.from('un-texte'), 'document.pdf');

        assert.equal(reponse.status, 400);
      });

      it('rejette les requêtes demandant de générer un visuel sans fournir de PDF', async () => {
        const reponse = await request(serveur)
          .post('/api/guides/zero-trust/documents')
          .set('Cookie', [cookieJeanneDupont])
          .field('libelleDuLien', 'Cliquez pour télécharger le document')
          .field('genereVisuel', true)
          .attach('document-guide', Buffer.from('un-texte'), 'document.txt');

        assert.equal(reponse.status, 400);
      });
    });

    describe("avec un identifiant de guide qui n'existe pas", () => {
      it('rejette la requête', async () => {
        const reponse = await request(serveur)
          .post('/api/guides/guide-inexistant/documents')
          .set('Cookie', [cookieJeanneDupont])
          .field('libelleDuLien', 'Cliquez pour télécharger le document')
          .attach('document-guide', Buffer.from('un-texte'), 'document.pdf');

        assert.equal(reponse.status, 404);
        assert.equal(reponse.body.erreur, 'Le guide "guide-inexistant" est introuvable');
      });
    });
  });

  describe('sur un GET', async () => {
    it('répond 200', async () => {
      const reponse = await request(serveur)
        .get('/api/guides/zero-trust/documents')
        .set('Cookie', [cookieJeanneDupont]);

      assert.equal(reponse.status, 200);
    });

    it('répond 401 si l’utilisateur n’est pas authentifié', async () => {
      const reponse = await request(serveur).get('/api/guides/zero-trust/documents');

      assert.equal(reponse.status, 401);
    });

    it("répond 403 si l’utilisateur n'a pas l'autorisation de gérer les guides", async () => {
      const cookieHectorDurant = encodeSession({
        email: hectorDurant.email,
        token: 'token',
      });

      const reponse = await request(serveur)
        .get('/api/guides/zero-trust/documents')
        .set('Cookie', [cookieHectorDurant]);

      assert.equal(reponse.status, 403);
    });

    it("répond 404 si le guide n'existe pas", async () => {
      const reponse = await request(serveur)
        .get('/api/guides/guide-inexistant/documents')
        .set('Cookie', [cookieJeanneDupont]);

      assert.equal(reponse.status, 404);
    });

    it('renvoie la liste des documents du guide', async () => {
      const guide = guideDevsecops();
      guide.listeDocuments = [
        {
          libelle: 'Les Essentiels de l&#039;ANSSI - DevSecOps - v1.0',
          nomFichier: 'anssi_essentiels_devsecops_v1.0.pdf',
        },
      ];
      await entrepotGuideTravail.ajoute(guide);

      const reponse = await request(serveur).get('/api/guides/devsecops/documents').set('Cookie', [cookieJeanneDupont]);

      assert.equal(reponse.body.length, 1);
      assert.deepEqual(reponse.body[0], {
        libelle: 'Les Essentiels de l&#039;ANSSI - DevSecOps - v1.0',
        nomFichier: 'anssi_essentiels_devsecops_v1.0.pdf',
        chemin: 'https://notre-cellar/gestion-guides/anssi_essentiels_devsecops_v1.0.pdf',
      });
    });
  });

  describe('sur un DELETE', () => {
    it('répond 204', async () => {
      guideZeroTrust.listeDocuments = [
        {
          libelle: 'Mon fichier',
          nomFichier: 'mon-fichier.pdf',
        },
      ];
      await entrepotGuideTravail.ajoute(guideZeroTrust);
      const reponse = await request(serveur)
        .delete('/api/guides/zero-trust/documents/mon-fichier.pdf')
        .set('Cookie', [cookieJeanneDupont]);

      assert.equal(reponse.status, 204);
    });

    it('répond 401 si l’utilisateur n’est pas authentifié', async () => {
      const reponse = await request(serveur).delete('/api/guides/zero-trust/documents/mon-fichier.pdf');

      assert.equal(reponse.status, 401);
    });

    it("répond 403 si l’utilisateur n'a pas l'autorisation de gérer les guides", async () => {
      const cookieHectorDurant = encodeSession({
        email: hectorDurant.email,
        token: 'token',
      });

      const reponse = await request(serveur)
        .delete('/api/guides/zero-trust/documents/mon-fichier.pdf')
        .set('Cookie', [cookieHectorDurant]);

      assert.equal(reponse.status, 403);
    });

    it("répond 404 si le guide n'existe pas", async () => {
      const reponse = await request(serveur)
        .delete('/api/guides/guide-inexistant/documents/mon-fichier.pdf')
        .set('Cookie', [cookieJeanneDupont]);

      assert.equal(reponse.status, 404);
    });

    it("répond 404 si le document n'existe pas", async () => {
      const reponse = await request(serveur)
        .delete('/api/guides/zero-trust/documents/fichier-inexistant.pdf')
        .set('Cookie', [cookieJeanneDupont]);

      assert.equal(reponse.status, 404);
    });

    it('supprime le document spécifié de la liste des documents du guide dans Grist', async () => {
      const guide = guideDevsecops();
      guide.listeDocuments = [
        {
          libelle: 'Les Essentiels de l&#039;ANSSI - DevSecOps - v1.0',
          nomFichier: 'anssi_essentiels_devsecops_v1.0.pdf',
        },
      ];
      await entrepotGuideTravail.ajoute(guide);

      await request(serveur)
        .delete('/api/guides/devsecops/documents/anssi_essentiels_devsecops_v1.0.pdf')
        .set('Cookie', [cookieJeanneDupont]);

      const guideMisAJour = await entrepotGuideTravail.parId('devsecops');
      assert.equal(guideMisAJour?.listeDocuments.length, 0);
    });

    it('supprime le document spécifié dans le cellar', async () => {
      let nomDuFichierSupprime = '';
      let cleDuBucketFournie = '';
      adaptateurCellar.supprime = async (nomDuFichier: string, cleDuBucket: CleDuBucket) => {
        nomDuFichierSupprime = nomDuFichier;
        cleDuBucketFournie = cleDuBucket;
      };
      const guide = guideDevsecops();
      guide.listeDocuments = [
        {
          libelle: 'Les Essentiels de l&#039;ANSSI - DevSecOps - v1.0',
          nomFichier: 'anssi_essentiels_devsecops_v1.0.pdf',
        },
      ];
      await entrepotGuideTravail.ajoute(guide);

      await request(serveur)
        .delete('/api/guides/devsecops/documents/anssi_essentiels_devsecops_v1.0.pdf')
        .set('Cookie', [cookieJeanneDupont]);

      assert.equal(cleDuBucketFournie, 'GESTION_GUIDES');
      assert.equal(nomDuFichierSupprime, 'anssi_essentiels_devsecops_v1.0.pdf');
    });
  });
});
