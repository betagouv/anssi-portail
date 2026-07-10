import assert from 'node:assert';
import { describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc.js';
import { AdaptateurEnvironnement } from '../../../src/infra/adaptateurEnvironnement.js';
import { configurationDeTestDuServeur, fauxAdaptateurEnvironnement } from '../fauxObjets.js';

describe('La ressource du parcours complet', () => {
  describe('sur requête GET', () => {
    it('retourne 200', async () => {
      const serveur = creeServeur(configurationDeTestDuServeur);

      const reponse = await request(serveur).get('/api/parcours/complet');

      const statut = reponse.status;
      assert.equal(statut, 200);
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
      const serveur = creeServeur(configuration);

      const reponse = await request(serveur).get('/api/parcours/complet');

      assert.equal(reponse.status, 404);
    });
  });
});
