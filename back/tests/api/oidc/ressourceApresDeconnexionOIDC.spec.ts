import { beforeEach, describe, it } from 'node:test';
import { Express } from 'express';
import request from 'supertest';
import assert from 'node:assert';
import { creeServeur } from '../../../src/api/msc';
import {
  configurationDeTestDuServeur,
} from '../fauxObjets';
import { encodeSession, enObjet } from '../cookie';

describe('La ressource apres deconnexion OIDC', () => {
  describe('quand on requete GET sur /oidc/apres-deconnexion', () => {
    let serveur: Express;

    beforeEach(() => {
      serveur = creeServeur(configurationDeTestDuServeur);
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
        .set('Cookie', [`AgentConnectInfo=${cookie}`]);

      const headerCookie = reponse.headers['set-cookie'];
      assert.notEqual(headerCookie, undefined);
      const cookieSession = enObjet(headerCookie[0]);

      assert.equal(cookieSession.AgentConnectInfo, '');
    });

    it('supprime le cookie contenant le session', async () => {
      let cookieAgentConnect = encodeURIComponent(
        `j:${JSON.stringify({ state: 'le-bon-state' })}`
      );
      let cookieSession = encodeSession({ token: 'token-session' });

      const reponse = await request(serveur)
        .get('/oidc/apres-deconnexion?state=le-bon-state')
        .set('Cookie', [
          `AgentConnectInfo=${cookieAgentConnect}`,
          cookieSession,
        ]);

      const headerCookie = reponse.headers['set-cookie'];

      const cookieSessionDecode = enObjet(headerCookie[1]);

      assert.equal(cookieSessionDecode.session, '');
    });
  });
});
