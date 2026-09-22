import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../../src/api/msc.js';
import { AgentConnectInfo, enObjet } from '../cookie.js';
import { configurationDeTestDuServeur, fauxAdaptateurOIDC } from '../fauxObjets.js';

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
      serveur = creeServeur({
        ...configurationDeTestDuServeur,
        adaptateurOIDC,
      });
    });

    it("redirige vers l'adresse proconnect", async () => {
      const reponse = await request(serveur).get('/oidc/connexion');

      expect(reponse.status).toBe(HttpStatusCode.Found);
      expect(reponse.headers.location).toBe('une-adresse-proconnect');
    });

    it('ecrit un cookie avec le state et le nonce', async () => {
      const reponse = await request(serveur).get('/oidc/connexion');

      const cookieHeader = reponse.headers['set-cookie'];
      expect(cookieHeader).toBeDefined();
      const cookie = enObjet(cookieHeader[0]);

      const { state, nonce } = cookie.AgentConnectInfo as AgentConnectInfo;
      expect(state).toBe('un faux state');
      expect(nonce).toBe('un faux nonce');
    });
  });
});
