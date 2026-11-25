import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../../src/api/msc/index.js';
import { OutilTéléchargé } from '../../../src/bus/evenements/outilTelecharge.js';
import { EntrepotUtilisateur } from '../../../src/metier/entrepotUtilisateur.js';
import { MockBusEvenement } from '../../bus/busPourLesTests.js';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire.js';
import { encodeSession } from '../cookie.js';
import { configurationDeTestDuServeur, fauxRapporteur } from '../fauxObjets.js';
import { jeanneDupont } from '../objetsPretsALEmploi.js';

describe("La ressource générique de téléchargement de documents d'outils ", () => {
  let serveur: Express;
  let busEvenements: MockBusEvenement;
  let entrepotUtilisateur: EntrepotUtilisateur;

  beforeEach(async () => {
    busEvenements = new MockBusEvenement(fauxRapporteur);
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();

    await entrepotUtilisateur.ajoute(jeanneDupont);

    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      busEvenements,
      entrepotUtilisateur,
    });
  });

  describe('Concernant le modèle de suivi des arrivées', () => {
    describe('sur une requête GET', () => {
      const cookieJeanneDupont = encodeSession({ email: jeanneDupont.email, token: 'valide' });
      const récupèreDocument = async () =>
        request(serveur)
          .get('/api/outils/modele-suivi-des-arrivees.docx')
          .set('Cookie', cookieJeanneDupont)
          .buffer(true)
          .parse((res, callback) => {
            const morceaux: Buffer[] = [];
            res.on('data', (morceau: Buffer) => morceaux.push(morceau));
            res.on('end', () => callback(null, Buffer.concat(morceaux)));
          });

      it('réponds 200', async () => {
        const { status } = await récupèreDocument();

        expect(status).toBe(HttpStatusCode.Ok);
      });

      it('renvoie un contenu DOCX', async () => {
        const { headers } = await récupèreDocument();

        expect(headers['content-type']).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        expect(headers['content-disposition']).toBe('attachment; filename=modele-suivi-des-arrivees.docx');
      });

      it('renvoie un fichier valide', async () => {
        const { body } = await récupèreDocument();

        expect(Buffer.isBuffer(body)).toBe(true);
        expect((body as Buffer).byteLength).toBe(40331);
      });

      it('refuse un utilisateur non connecté', async () => {
        const { status } = await request(serveur).get('/api/outils/modele-suivi-des-arrivees.docx');

        expect(status).toBe(HttpStatusCode.Unauthorized);
      });

      it('publie un évènement de téléchargement', async () => {
        await récupèreDocument();

        expect(busEvenements.aRecuUnEvenement(OutilTéléchargé)).toBe(true);
        const évènement = busEvenements.recupereEvenement(OutilTéléchargé);
        expect(évènement!.outil).toBe('modele-suivi-des-arrivees.docx');
        expect(évènement!.email).toBe(jeanneDupont.email);
      });
    });
  });

  describe('Concernant le modèle de suivi des changement de fonctions', () => {
    describe('sur une requête GET', () => {
      const cookieJeanneDupont = encodeSession({ email: jeanneDupont.email, token: 'valide' });
      const récupèreDocument = async () =>
        request(serveur)
          .get('/api/outils/modele-suivi-de-changement-de-fonction.docx')
          .set('Cookie', cookieJeanneDupont)
          .buffer(true)
          .parse((res, callback) => {
            const morceaux: Buffer[] = [];
            res.on('data', (morceau: Buffer) => morceaux.push(morceau));
            res.on('end', () => callback(null, Buffer.concat(morceaux)));
          });

      it('réponds 200', async () => {
        const { status } = await récupèreDocument();

        expect(status).toBe(HttpStatusCode.Ok);
      });

      it('renvoie un contenu DOCX', async () => {
        const { headers } = await récupèreDocument();

        expect(headers['content-type']).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        expect(headers['content-disposition']).toBe('attachment; filename=modele-suivi-de-changement-de-fonction.docx');
      });

      it('renvoie un fichier valide', async () => {
        const { body } = await récupèreDocument();

        expect(Buffer.isBuffer(body)).toBe(true);
        expect((body as Buffer).byteLength).toBe(39481);
      });

      it('refuse un utilisateur non connecté', async () => {
        const { status } = await request(serveur).get('/api/outils/modele-suivi-de-changement-de-fonction.docx');

        expect(status).toBe(HttpStatusCode.Unauthorized);
      });

      it('publie un évènement de téléchargement', async () => {
        await récupèreDocument();

        expect(busEvenements.aRecuUnEvenement(OutilTéléchargé)).toBe(true);
        const évènement = busEvenements.recupereEvenement(OutilTéléchargé);
        expect(évènement!.outil).toBe('modele-suivi-de-changement-de-fonction.docx');
        expect(évènement!.email).toBe(jeanneDupont.email);
      });
    });
  });
});
