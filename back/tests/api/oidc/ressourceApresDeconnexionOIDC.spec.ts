import { HttpStatusCode } from '@anssi-portail/axios';
import { beforeEach, describe, it, expect } from 'vitest';
import { Express } from 'express';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc.js';
import { configurationDeTestDuServeur } from '../fauxObjets.js';
import { encodeSession, enObjet } from '../cookie.js';

describe('La ressource apres deconnexion OIDC', () => {
  describe('quand on requete GET sur /oidc/apres-deconnexion', () => {
    let serveur: Express;

    beforeEach(() => {
      serveur = creeServeur(configurationDeTestDuServeur);
    });

    it("redirige vers la page d'accueil", async () => {
      const cookie = encodeURIComponent('j:' + JSON.stringify({ state: 'le-bon-state' }));

      const reponse = await request(serveur)
        .get('/oidc/apres-deconnexion?state=le-bon-state')
        .set('Cookie', [`AgentConnectInfo=${cookie}`]);

      expect(reponse.status).toBe(HttpStatusCode.Found);
      expect(reponse.headers.location).toBe('/');
    });

    it("ne deconnecte l'utilisateur si le state ne correspond pas", async () => {
      const cookie = encodeURIComponent('j:' + JSON.stringify({ state: 'le-bon-state' }));

      const reponse = await request(serveur)
        .get('/oidc/apres-deconnexion?state=pas-le-bon-state')
        .set('Cookie', [`AgentConnectInfo=${cookie}`]);

      expect(reponse.status).toBe(HttpStatusCode.Unauthorized);
    });

    it('supprime le cookie contenant le state', async () => {
      const cookie = encodeURIComponent(`j:${JSON.stringify({ state: 'le-bon-state' })}`);

      const reponse = await request(serveur)
        .get('/oidc/apres-deconnexion?state=le-bon-state')
        .set('Cookie', [`AgentConnectInfo=${cookie}`]);

      const headerCookie = reponse.headers['set-cookie'];
      expect(headerCookie).toBeDefined();
      const cookieSession = enObjet(headerCookie[0]);

      expect(cookieSession.AgentConnectInfo).toBe('');
    });

    it('supprime le cookie contenant le session', async () => {
      const cookieAgentConnect = encodeURIComponent(`j:${JSON.stringify({ state: 'le-bon-state' })}`);
      const cookieSession = encodeSession({ token: 'token-session' });

      const reponse = await request(serveur)
        .get('/oidc/apres-deconnexion?state=le-bon-state')
        .set('Cookie', [`AgentConnectInfo=${cookieAgentConnect}`, cookieSession]);

      const headerCookie = reponse.headers['set-cookie'];

      const cookieSessionDecode = enObjet(headerCookie[1]);

      expect(cookieSessionDecode.session).toBe('');
    });
  });
});
