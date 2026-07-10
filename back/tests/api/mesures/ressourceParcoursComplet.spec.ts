import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc.js';
import { AdaptateurEnvironnement } from '../../../src/infra/adaptateurEnvironnement.js';
import { configurationDeTestDuServeur, fauxAdaptateurEnvironnement } from '../fauxObjets.js';
import { encodeSession } from '../cookie.js';
import { jeanneDupont } from '../objetsPretsALEmploi.js';
import { Express } from 'express';

describe('La ressource du parcours complet', () => {
  describe('sur requête GET', () => {
    let serveur: Express;
    let cookieDeJeanneDupont: string;

    beforeEach(() => {
      serveur = creeServeur(configurationDeTestDuServeur);

      cookieDeJeanneDupont = encodeSession({
        email: jeanneDupont.email,
        token: 'valide',
      });
    });

    it('retourne 200', async () => {
      const reponse = await request(serveur).get('/api/parcours/complet').set('Cookie', cookieDeJeanneDupont);

      assert.equal(reponse.status, 200);
    });

    it('retourne 404 si la fonctionnalité est désactivée', async () => {
      const adaptateurEnvironnement: AdaptateurEnvironnement = {
        ...fauxAdaptateurEnvironnement,
        fonctionnalites: () => ({
          ...fauxAdaptateurEnvironnement.fonctionnalites(),
          parcoursDeSecurisation: () => ({
            estActif: () => false,
          }),
        }),
      };
      const configuration = {
        ...configurationDeTestDuServeur,
        adaptateurEnvironnement,
      };
      const serveurSansLaRessource = creeServeur(configuration);

      const reponse = await request(serveurSansLaRessource).get('/api/parcours/complet');

      assert.equal(reponse.status, 404);
    });

    it("retourne 401 si l'utilisateur n'est pas connecté", async () => {
      const serveur = creeServeur(configurationDeTestDuServeur);

      const reponse = await request(serveur).get('/api/parcours/complet');

      assert.equal(reponse.status, 401);
    });
  });
});
