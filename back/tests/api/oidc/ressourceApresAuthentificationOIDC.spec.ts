import { beforeEach, describe, it } from 'node:test';
import { Express } from 'express';
import request from 'supertest';
import assert from 'node:assert';
import { ConfigurationServeur } from '../../../src/api/configurationServeur';
import { fabriqueMiddleware } from '../../../src/api/middleware';
import { creeServeur } from '../../../src/api/msc';
import { fauxAdaptateurOIDC, fauxFournisseurDeChemin } from '../fauxObjets';
import { join } from 'node:path';

describe('La ressource apres authentification OIDC', () => {
  describe('quand on fait un GET sur /oidc/apres-authentification', () => {
    let serveur: Express;
    let fournisseurChemin = fauxFournisseurDeChemin;
    beforeEach(() => {
      const configurationServeur: ConfigurationServeur = {
        fournisseurChemin,
        middleware: fabriqueMiddleware(),
        adaptateurOIDC: fauxAdaptateurOIDC,
      };
      serveur = creeServeur(configurationServeur);
    });
    it('recois 200', async () => {
      const reponse = await request(serveur).get(
        '/oidc/apres-authentification'
      );

      assert.equal(reponse.status, 200);
    });
    it('sers la page apres-authentification', async () => {
      let nomPageDemande;
      fournisseurChemin.cheminPageJekyll = (nomPage) => {
        nomPageDemande = nomPage;
        return join(process.cwd(), 'tests', 'ressources', 'factice.html');
      };
      const reponse = await request(serveur).get(
        '/oidc/apres-authentification'
      );

      assert.equal(nomPageDemande, 'apres-authentification');
    });
  });
});
