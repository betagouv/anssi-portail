import { HttpStatusCode } from '@anssi-portail/axios';
import { beforeEach, describe, it, expect } from 'vitest';
import { Express } from 'express';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc.js';
import { AgentConnectInfo, encodeSession, enObjet } from '../cookie.js';
import { configurationDeTestDuServeur, fauxAdaptateurOIDC } from '../fauxObjets.js';

describe('La ressource deconnexion OIDC', () => {
  describe('quand on requete GET sur /oidc/deconnexion', () => {
    let serveur: Express;
    let idTokenRecu: string;
    beforeEach(() => {
      const adaptateurOIDC = fauxAdaptateurOIDC;
      adaptateurOIDC.genereDemandeDeconnexion = async (idToken: string) => {
        idTokenRecu = idToken;
        return {
          url: 'une-adresse-proconnect',
          state: 'un faux state',
        };
      };
      serveur = creeServeur({
        ...configurationDeTestDuServeur,
        adaptateurOIDC,
      });
    });

    it('redirige vers url de deconnexion', async () => {
      const cookie = encodeSession({
        AgentConnectIdToken: 'idToken',
      });

      const reponse = await request(serveur).get('/oidc/deconnexion').set('Cookie', [cookie]);

      expect(reponse.status).toBe(HttpStatusCode.Found);
      expect(reponse.headers.location).toBe('une-adresse-proconnect');
      expect(idTokenRecu).toBe('idToken');
    });

    it('dépose un cookie avec le state', async () => {
      const cookie = encodeSession({
        AgentConnectIdToken: 'idToken',
      });

      const reponse = await request(serveur).get('/oidc/deconnexion').set('Cookie', [cookie]);
      const headerCookie = reponse.headers['set-cookie'];
      const cookieSession = enObjet(headerCookie[0]);

      expect((cookieSession.AgentConnectInfo as AgentConnectInfo).state).toBe('un faux state');
    });
  });
});
