import { Readable } from 'node:stream';
import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../../src/api/msc/index.js';
import { OutilTéléchargé } from '../../../src/bus/evenements/outilTelecharge.js';
import { AdaptateurCellar, CleDuBucket } from '../../../src/infra/adaptateurCellar.js';
import { EntrepotUtilisateur } from '../../../src/metier/entrepotUtilisateur.js';
import { MockBusEvenement } from '../../bus/busPourLesTests.js';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire.js';
import { encodeSession } from '../cookie.js';
import { configurationDeTestDuServeur, fauxAdaptateurCellar } from '../fauxObjets.js';
import { jeanneDupont } from '../objetsPretsALEmploi.js';

describe('La ressource du kit de sensibilisation interne', () => {
  const contenuDuZip = Buffer.from('PK-contenu-factice');
  let serveur: Express;
  let busEvenements: MockBusEvenement;
  let entrepotUtilisateur: EntrepotUtilisateur;
  let cellar: AdaptateurCellar;
  let demandes: { nomDuFichier: string; cleDuBucket: CleDuBucket }[];

  const fabriqueServeur = (kitPresentDansCellar: boolean) => {
    demandes = [];
    cellar = {
      ...fauxAdaptateurCellar,
      getStream: async (nomDuFichier, cleDuBucket) => {
        demandes.push({ nomDuFichier, cleDuBucket });
        if (!kitPresentDansCellar) return undefined;
        return {
          flux: Readable.from([contenuDuZip]),
          typeDeContenu: 'application/zip',
          tailleDuContenu: contenuDuZip.length,
        };
      },
    };
    serveur = creeServeur({ ...configurationDeTestDuServeur, busEvenements, cellar, entrepotUtilisateur });
  };

  beforeEach(async () => {
    busEvenements = new MockBusEvenement();
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    await entrepotUtilisateur.ajoute(jeanneDupont);
    fabriqueServeur(true);
  });

  describe('sur une requête GET', () => {
    const cookieJeanneDupont = encodeSession({ email: jeanneDupont.email, token: 'valide' });
    const récupèreKit = async () =>
      request(serveur)
        .get('/api/outils/kit-de-sensibilisation-interne')
        .set('Cookie', cookieJeanneDupont)
        .buffer(true)
        .parse((res, callback) => {
          const morceaux: Buffer[] = [];
          res.on('data', (morceau: Buffer) => morceaux.push(morceau));
          res.on('end', () => callback(null, Buffer.concat(morceaux)));
        });

    it('réponds 200', async () => {
      const { status } = await récupèreKit();

      expect(status).toBe(HttpStatusCode.Ok);
    });

    it('renvoie un contenu ZIP à télécharger', async () => {
      const { headers } = await récupèreKit();

      expect(headers['content-type']).toBe('application/zip');
      expect(headers['content-disposition']).toBe('attachment; filename="ANSSI - Kit de sensibilisation interne.zip"');
      expect(headers['content-length']).toBe(String(contenuDuZip.length));
    });

    it("renvoie le contenu de l'archive stockée dans le Cellar des ressources cyber", async () => {
      const { body } = await récupèreKit();

      expect(body).toEqual(contenuDuZip);
      expect(demandes).toEqual([
        { nomDuFichier: 'kit-de-sensibilisation-interne-V1.zip', cleDuBucket: 'RESSOURCES_CYBER' },
      ]);
    });

    it("réponds 404 si l'archive est absente du Cellar, sans publier d'évènement", async () => {
      fabriqueServeur(false);

      const { status } = await récupèreKit();

      expect(status).toBe(HttpStatusCode.NotFound);
      expect(busEvenements.naPasRecuDEvenement(OutilTéléchargé)).toBe(true);
    });

    it('refuse un utilisateur non connecté', async () => {
      const { status } = await request(serveur).get('/api/outils/kit-de-sensibilisation-interne');

      expect(status).toBe(HttpStatusCode.Unauthorized);
    });

    it('publie un évènement de téléchargement', async () => {
      await récupèreKit();

      expect(busEvenements.aRecuUnEvenement(OutilTéléchargé)).toBe(true);
      const évènement = busEvenements.recupereEvenement(OutilTéléchargé);
      expect(évènement!.outil).toBe('kit-de-sensibilisation-interne');
      expect(évènement!.email).toBe(jeanneDupont.email);
    });
  });
});
