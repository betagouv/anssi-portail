import { beforeEach, describe, it } from 'node:test';
import { Express } from 'express';
import assert from 'node:assert';
import { configurationDeTestDuServeur, fauxAdaptateurJWT } from './fauxObjets';
import { creeServeur } from '../../src/api/msc';
import request from 'supertest';
import { encodeSession, enObjet } from './cookie';
import { JsonWebTokenError } from 'jsonwebtoken';

describe('La ressource Profil', () => {
  let serveur: Express;

  beforeEach(() => {
    serveur = creeServeur(configurationDeTestDuServeur);
  });

  describe('sur demande GET', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/api/profil');

      assert.equal(reponse.status, 200);
    });

    it('renvoie les informations utilisateur stockées dans la session', async () => {
      let cookie = encodeSession({
        nom: 'Dupont',
        prenom: 'Jeanne',
        email: 'jeanne.dupont',
        siret: '1234',
      });

      const reponse = await request(serveur)
        .get('/api/profil')
        .set('Cookie', [cookie]);

      assert.equal(reponse.body.nom, 'Dupont');
      assert.equal(reponse.body.prenom, 'Jeanne');
      assert.equal(reponse.body.email, 'jeanne.dupont');
      assert.equal(reponse.body.siret, '1234');
    });

    it('supprime la session si le token JWT est invalide', async () => {
      let cookieSession = encodeSession({ token: 'token-session' });

      serveur = creeServeur({
        ...configurationDeTestDuServeur,
        adaptateurJWT: {
          ...fauxAdaptateurJWT,
          decode(_: string) {
            throw new JsonWebTokenError('mauvais token');
          },
        },
      });
      const reponse = await request(serveur)
        .get('/api/profil')
        .set('Cookie', [cookieSession]);

      const headerCookie = reponse.headers['set-cookie'];
      assert.notEqual(headerCookie, undefined);
      const cookieSessionDecode = enObjet(headerCookie[0]);
      assert.equal(cookieSessionDecode.session, '');
    });
  });
});
