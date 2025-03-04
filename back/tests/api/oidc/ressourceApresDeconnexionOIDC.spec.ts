import { beforeEach, describe, it } from 'node:test';
import { Express } from 'express';
import request from 'supertest';
import assert from 'node:assert';
import { ConfigurationServeur } from '../../../src/api/configurationServeur';
import { fabriqueMiddleware } from '../../../src/api/middleware';
import { creeServeur } from '../../../src/api/msc';
import {
  fauxAdaptateurJWT,
  fauxAdaptateurOIDC,
  fauxFournisseurDeChemin,
} from '../fauxObjets';
import { enObjet } from '../cookie';

describe('La ressource apres deconnexion OIDC', () => {
  describe('quand on requete GET sur /oidc/apres-deconnexion', () => {
    let serveur: Express;

    beforeEach(() => {
      const configurationServeur: ConfigurationServeur = {
        fournisseurChemin: fauxFournisseurDeChemin,
        middleware: fabriqueMiddleware(),
        adaptateurJWT: fauxAdaptateurJWT,
        adaptateurOIDC: fauxAdaptateurOIDC,
      };
      serveur = creeServeur(configurationServeur);
    });

    it("redirige vers la page d'accueil", async () => {
      let cookie = encodeURIComponent(
        'j:' + JSON.stringify({ state: 'le-bon-state' })
      );

      const reponse = await request(serveur)
        .get('/oidc/apres-deconnexion?state=le-bon-state')
        .set('Cookie', [`AgentConnectInfo=${cookie}`]);

      assert.equal(reponse.status, 302);
      assert.equal(reponse.headers.location, '/');
    });

    it("ne deconnecte l'utilisateur si le state ne correspond pas", async () => {
      let cookie = encodeURIComponent(
        'j:' + JSON.stringify({ state: 'le-bon-state' })
      );

      const reponse = await request(serveur)
        .get('/oidc/apres-deconnexion?state=pas-le-bon-state')
        .set('Cookie', [`AgentConnectInfo=${cookie}`]);

      assert.equal(reponse.status, 401);
    });

    it('supprime le cookie contenant le state', async () => {
      let cookie = encodeURIComponent(
        `j:${JSON.stringify({ state: 'le-bon-state' })}`
      );

      const reponse = await request(serveur)
        .get('/oidc/apres-deconnexion?state=le-bon-state')
        .set('Cookie', [`AgentConnectInfo=${cookie}`])
        .redirects(0);

      const headerCookie = reponse.headers['set-cookie'];
      assert.notEqual(headerCookie, undefined);
      const cookieSession = enObjet(headerCookie[0]);

      assert.equal(cookieSession.AgentConnectInfo, '');
    });
  });
});
