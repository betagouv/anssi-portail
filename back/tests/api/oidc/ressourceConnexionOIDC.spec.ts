import { beforeEach, describe, it } from 'node:test';
import { Express } from 'express';
import request from 'supertest';
import assert from 'node:assert';
import { ConfigurationServeur } from '../../../src/api/configurationServeur';
import { fabriqueMiddleware } from '../../../src/api/middleware';
import { creeServeur } from '../../../src/api/msc';
import { enObjet } from '../cookie';
import {
  fauxAdaptateurJWT,
  fauxAdaptateurOIDC,
  fauxFournisseurDeChemin,
} from '../fauxObjets';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire';

describe('La ressource connexion OIDC', () => {
  describe('quand on requete GET sur /oidc/connexion', () => {
    let serveur: Express;
    beforeEach(() => {
      const adaptateurOIDC = fauxAdaptateurOIDC;
      adaptateurOIDC.genereDemandeAutorisation = async () => ({
        url: 'une-adresse-proconnect',
        state: 'un faux state',
        nonce: 'un faux nonce',
      });
      const configurationServeur: ConfigurationServeur = {
        fournisseurChemin: fauxFournisseurDeChemin,
        middleware: fabriqueMiddleware(),
        adaptateurJWT: fauxAdaptateurJWT,
        adaptateurOIDC,
        entrepotUtilisateur: new EntrepotUtilisateurMemoire(),
      };
      serveur = creeServeur(configurationServeur);
    });

    it("redirige vers l'adresse proconnect", async () => {
      const reponse = await request(serveur).get('/oidc/connexion');

      assert.equal(reponse.status, 302);
      assert.equal(reponse.headers.location, 'une-adresse-proconnect');
    });

    it('ecrit un cookie avec le state et le nonce', async () => {
      const reponse = await request(serveur).get('/oidc/connexion');

      const cookieHeader = reponse.headers['set-cookie'];
      assert.notEqual(cookieHeader, undefined);
      const cookie = enObjet(cookieHeader[0]);
      const { state, nonce } = cookie.AgentConnectInfo;
      assert.equal(state, 'un faux state');
      assert.equal(nonce, 'un faux nonce');
    });
  });
});
