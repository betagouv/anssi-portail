import { beforeEach, describe, it } from 'node:test';
import { Express } from 'express';
import request from 'supertest';
import assert from 'node:assert';
import { creeServeur } from '../../../src/api/msc';
import { AgentConnectInfo, encodeSession, enObjet } from '../cookie';
import {
  configurationDeTestDuServeur,
  fauxAdaptateurOIDC,
} from '../fauxObjets';

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

      const reponse = await request(serveur)
        .get('/oidc/deconnexion')
        .set('Cookie', [cookie]);

      assert.equal(reponse.status, 302);
      assert.equal(reponse.headers.location, 'une-adresse-proconnect');
      assert.equal(idTokenRecu, 'idToken');
    });

    it('dépose un cookie avec le state', async () => {
      const cookie = encodeSession({
        AgentConnectIdToken: 'idToken',
      });

      const reponse = await request(serveur)
        .get('/oidc/deconnexion')
        .set('Cookie', [cookie]);
      const headerCookie = reponse.headers['set-cookie'];
      const cookieSession = enObjet(headerCookie[0]);

      assert.equal(
        (cookieSession.AgentConnectInfo as AgentConnectInfo).state,
        'un faux state'
      );
    });
  });
});
