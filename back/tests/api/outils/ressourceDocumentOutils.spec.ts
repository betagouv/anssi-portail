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
  const documentsOutil = [
    { fichier: 'modele-suivi-des-arrivees.docx', taille: 40331 },
    { fichier: 'modele-suivi-de-changement-de-fonction.docx', taille: 39481 },
  ];

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

  describe.each(documentsOutil)('Concernant le fichier $fichier', ({ fichier, taille }) => {
    describe('sur une requête GET', () => {
      const cookieJeanneDupont = encodeSession({ email: jeanneDupont.email, token: 'valide' });
      const récupèreDocument = async () =>
        request(serveur)
          .get(`/api/outils/${fichier}`)
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
        expect(headers['content-disposition']).toBe(`attachment; filename=${fichier}`);
      });

      it('renvoie un fichier valide', async () => {
        const { body } = await récupèreDocument();

        expect(Buffer.isBuffer(body)).toBe(true);
        expect((body as Buffer).byteLength).toBe(taille);
      });

      it('refuse un utilisateur non connecté', async () => {
        const { status } = await request(serveur).get(`/api/outils/${fichier}`);

        expect(status).toBe(HttpStatusCode.Unauthorized);
      });

      it('publie un évènement de téléchargement', async () => {
        await récupèreDocument();

        expect(busEvenements.aRecuUnEvenement(OutilTéléchargé)).toBe(true);
        const évènement = busEvenements.recupereEvenement(OutilTéléchargé);
        expect(évènement!.outil).toBe(fichier);
        expect(évènement!.email).toBe(jeanneDupont.email);
      });
    });
  });
});
