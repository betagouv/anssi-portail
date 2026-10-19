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
import { configurationDeTestDuServeur } from '../fauxObjets.js';
import { jeanneDupont } from '../objetsPretsALEmploi.js';

describe("La ressource du modèle de l'annuaire de crise", () => {
  let serveur: Express;
  let busEvenements: MockBusEvenement;
  let entrepotUtilisateur: EntrepotUtilisateur;

  beforeEach(async () => {
    busEvenements = new MockBusEvenement();
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();

    await entrepotUtilisateur.ajoute(jeanneDupont);

    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      busEvenements,
      entrepotUtilisateur,
    });
  });

  describe('sur une requête GET', () => {
    const cookieJeanneDupont = encodeSession({ email: jeanneDupont.email, token: 'valide' });
    const récupèreModèle = async () =>
      request(serveur)
        .get('/api/outils/modele-annuaire-de-crise.xlsx')
        .set('Cookie', cookieJeanneDupont)
        .buffer(true)
        .parse((res, callback) => {
          const morceaux: Buffer[] = [];
          res.on('data', (morceau: Buffer) => morceaux.push(morceau));
          res.on('end', () => callback(null, Buffer.concat(morceaux)));
        });

    it('réponds 200', async () => {
      const { status } = await récupèreModèle();

      expect(status).toBe(HttpStatusCode.Ok);
    });

    it('renvoie un contenu XLSX', async () => {
      const { headers } = await récupèreModèle();

      expect(headers['content-type']).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      expect(headers['content-disposition']).toBe('attachment; filename=modele-annuaire-de-crise.xlsx');
    });

    it('renvoie un fichier valide', async () => {
      const { body } = await récupèreModèle();

      expect(Buffer.isBuffer(body)).toBe(true);
    });

    it('refuse un utilisateur non connecté', async () => {
      const { status } = await request(serveur).get('/api/outils/modele-annuaire-de-crise.xlsx');

      expect(status).toBe(HttpStatusCode.Unauthorized);
    });

    it('publie un évènement de téléchargement', async () => {
      await récupèreModèle();

      expect(busEvenements.aRecuUnEvenement(OutilTéléchargé)).toBe(true);
      const évènement = busEvenements.recupereEvenement(OutilTéléchargé);
      expect(évènement!.outil).toBe('Modèle_annuaire_crise');
      expect(évènement!.email).toBe(jeanneDupont.email);
    });
  });
});
