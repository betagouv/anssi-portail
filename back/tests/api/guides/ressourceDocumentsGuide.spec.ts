import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import { beforeEach, describe, it, expect } from 'vitest';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc.js';
import { AdaptateurCellar, CleDuBucket, DocumentCellar } from '../../../src/infra/adaptateurCellar.js';
import { GenerateurImage } from '../../../src/infra/generateurImage.js';
import { EntrepotUtilisateur } from '../../../src/metier/entrepotUtilisateur.js';
import { Guide } from '../../../src/metier/guide.js';
import { EntrepotGuideTravailMemoire } from '../../persistance/entrepotGuideTravailMemoire.js';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire.js';
import { encodeSession } from '../cookie.js';
import { configurationDeTestDuServeur, fauxAdaptateurCellar } from '../fauxObjets.js';
import * as fabrique from '../objetsPretsALEmploi.js';
import { guideDevsecops, hectorDurant, jeanneDupont } from '../objetsPretsALEmploi.js';

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
      connexionAvecMFA: true,
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

      expect(reponse.status).toBe(HttpStatusCode.Created);
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

      expect(fichierDepose.contenu).toHaveLength(8);
      expect(fichierDepose.nom).toBe('document.pdf');
      expect(fichierDepose.typeDeContenu).toBe('application/pdf');
      expect(cleDuBucketFournie).toBe('GESTION_GUIDES');
    });

    it('ajoute le document dans Grist', async () => {
      await request(serveur)
        .post('/api/guides/zero-trust/documents')
        .set('Cookie', [cookieJeanneDupont])
        .field('libelleDuLien', 'Cliquez pour télécharger le document')
        .attach('document-guide', Buffer.from('un-texte'), 'document.pdf');

      const monGuide = await entrepotGuideTravail.parId('zero-trust');
      expect(monGuide?.listeDocuments).toHaveLength(2);
      expect(monGuide?.listeDocuments[1].libelle).toBe('Cliquez pour télécharger le document');
      expect(monGuide?.listeDocuments[1].nomFichier).toBe('document.pdf');
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

      expect(fichiersDeposes).toHaveLength(3);
      expect(fichiersDeposes[0].nom).toBe('document.pdf');
      expect(fichiersDeposes[1].nom).toBe('zero-trust/origine.avif');
      expect(fichiersDeposes[2].nom).toBe('zero-trust/588.avif');
      expect(fichiersFournis).toHaveLength(2);
      expect(fichiersFournis[0]).toHaveLength(8);
      expect(fichiersFournis[1]).toHaveLength(8);
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

      expect(reponse.status).toBe(HttpStatusCode.BadRequest);
    });

    it('répond 401 si l’utilisateur n’est pas authentifié', async () => {
      const reponse = await request(serveur).post('/api/guides/zero-trust/documents');

      expect(reponse.status).toBe(HttpStatusCode.Unauthorized);
    });

    it("répond 403 si l’utilisateur n'a pas le droit de gérer les guides", async () => {
      const cookieHectorDurant = encodeSession({
        email: hectorDurant.email,
        token: 'token',
      });

      const reponse = await request(serveur)
        .post('/api/guides/zero-trust/documents')
        .set('Cookie', [cookieHectorDurant])
        .field('libelleDuLien', 'Cliquez pour télécharger le document')
        .attach('document-guide', Buffer.from('un-texte'), 'document.pdf');

      expect(reponse.status).toBe(HttpStatusCode.Forbidden);
    });

    it("répond 403 si l’utilisateur n'a pas activé le MFA", async () => {
      const cookieHectorDurant = encodeSession({
        email: jeanneDupont.email,
        token: 'token',
      });

      const reponse = await request(serveur)
        .post('/api/guides/zero-trust/documents')
        .set('Cookie', [cookieHectorDurant])
        .field('libelleDuLien', 'Cliquez pour télécharger le document')
        .attach('document-guide', Buffer.from('un-texte'), 'document.pdf');

      expect(reponse.status).toBe(HttpStatusCode.Forbidden);
    });

    describe('avec un corps de requête', () => {
      it('rejette les requêtes sans fichier', async () => {
        const reponse = await request(serveur)
          .post('/api/guides/zero-trust/documents')
          .set('Cookie', [cookieJeanneDupont])
          .field('libelleDuLien', 'Cliquez pour télécharger le document');

        expect(reponse.status).toBe(HttpStatusCode.BadRequest);
      });

      it('rejette les requêtes sans libelle de lien', async () => {
        const reponse = await request(serveur)
          .post('/api/guides/zero-trust/documents')
          .set('Cookie', [cookieJeanneDupont])
          .attach('document-guide', Buffer.from('un-texte'), 'document.pdf');

        expect(reponse.status).toBe(HttpStatusCode.BadRequest);
      });

      it('rejette les requêtes demandant de générer un visuel sans fournir de PDF', async () => {
        const reponse = await request(serveur)
          .post('/api/guides/zero-trust/documents')
          .set('Cookie', [cookieJeanneDupont])
          .field('libelleDuLien', 'Cliquez pour télécharger le document')
          .field('genereVisuel', true)
          .attach('document-guide', Buffer.from('un-texte'), 'document.txt');

        expect(reponse.status).toBe(HttpStatusCode.BadRequest);
      });

      it('rejette un nom de fichier dépassant 256 caractères', async () => {
        const reponse = await request(serveur)
          .post('/api/guides/zero-trust/documents')
          .set('Cookie', [cookieJeanneDupont])
          .field('libelleDuLien', 'Cliquez pour télécharger le document')
          .attach('document-guide', Buffer.from('un-texte'), 'a'.repeat(257));

        expect(reponse.status).toBe(HttpStatusCode.BadRequest);
      });
    });

    describe("avec un identifiant de guide qui n'existe pas", () => {
      it('rejette la requête', async () => {
        const reponse = await request(serveur)
          .post('/api/guides/guide-inexistant/documents')
          .set('Cookie', [cookieJeanneDupont])
          .field('libelleDuLien', 'Cliquez pour télécharger le document')
          .attach('document-guide', Buffer.from('un-texte'), 'document.pdf');

        expect(reponse.status).toBe(HttpStatusCode.NotFound);
        expect(reponse.body.erreur).toBe('Le guide "guide-inexistant" est introuvable');
      });
    });
  });

  describe('sur un GET', async () => {
    it('répond 200', async () => {
      const reponse = await request(serveur)
        .get('/api/guides/zero-trust/documents')
        .set('Cookie', [cookieJeanneDupont]);

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it('répond 401 si l’utilisateur n’est pas authentifié', async () => {
      const reponse = await request(serveur).get('/api/guides/zero-trust/documents');

      expect(reponse.status).toBe(HttpStatusCode.Unauthorized);
    });

    it("répond 403 si l’utilisateur n'a pas l'autorisation de gérer les guides", async () => {
      const cookieHectorDurant = encodeSession({
        email: hectorDurant.email,
        token: 'token',
      });

      const reponse = await request(serveur)
        .get('/api/guides/zero-trust/documents')
        .set('Cookie', [cookieHectorDurant]);

      expect(reponse.status).toBe(HttpStatusCode.Forbidden);
    });

    it("répond 404 si le guide n'existe pas", async () => {
      const reponse = await request(serveur)
        .get('/api/guides/guide-inexistant/documents')
        .set('Cookie', [cookieJeanneDupont]);

      expect(reponse.status).toBe(HttpStatusCode.NotFound);
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

      expect(reponse.body).toHaveLength(1);
      expect(reponse.body[0]).toEqual({
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

      expect(reponse.status).toBe(HttpStatusCode.NoContent);
    });

    it('répond 401 si l’utilisateur n’est pas authentifié', async () => {
      const reponse = await request(serveur).delete('/api/guides/zero-trust/documents/mon-fichier.pdf');

      expect(reponse.status).toBe(HttpStatusCode.Unauthorized);
    });

    it("répond 403 si l’utilisateur n'a pas l'autorisation de gérer les guides", async () => {
      const cookieHectorDurant = encodeSession({
        email: hectorDurant.email,
        token: 'token',
      });

      const reponse = await request(serveur)
        .delete('/api/guides/zero-trust/documents/mon-fichier.pdf')
        .set('Cookie', [cookieHectorDurant]);

      expect(reponse.status).toBe(HttpStatusCode.Forbidden);
    });

    it("répond 404 si le guide n'existe pas", async () => {
      const reponse = await request(serveur)
        .delete('/api/guides/guide-inexistant/documents/mon-fichier.pdf')
        .set('Cookie', [cookieJeanneDupont]);

      expect(reponse.status).toBe(HttpStatusCode.NotFound);
    });

    it("répond 404 si le document n'existe pas", async () => {
      const reponse = await request(serveur)
        .delete('/api/guides/zero-trust/documents/fichier-inexistant.pdf')
        .set('Cookie', [cookieJeanneDupont]);

      expect(reponse.status).toBe(HttpStatusCode.NotFound);
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
      expect(guideMisAJour?.listeDocuments).toHaveLength(0);
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

      expect(cleDuBucketFournie).toBe('GESTION_GUIDES');
      expect(nomDuFichierSupprime).toBe('anssi_essentiels_devsecops_v1.0.pdf');
    });
  });
});
