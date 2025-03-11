import { beforeEach, describe, it } from 'node:test';
import { Express } from 'express';
import assert from 'node:assert';
import { configurationDeTestDuServeur, fauxAdaptateurJWT } from './fauxObjets';
import { creeServeur } from '../../src/api/msc';
import request from 'supertest';
import { encodeSession } from './cookie';
import { AdaptateurJWT } from '../../src/api/adaptateurJWT';
import { JsonWebTokenError } from 'jsonwebtoken';

describe('La ressource Profil', () => {
  let serveur: Express;
  let adaptateurJWT: AdaptateurJWT;

  beforeEach(() => {
    adaptateurJWT = fauxAdaptateurJWT;
    serveur = creeServeur({...configurationDeTestDuServeur, adaptateurJWT});
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
  });

  describe('sur demande GET /verification-token-creation-compte', () => {
    it('jette une erreur si le token est invalide', async () => {
      adaptateurJWT.decode = () => { throw new JsonWebTokenError('Token manquant')};
      const reponse = await request(serveur)
        .get('/api/profil/verification-token-creation-compte?token=unMauvaisToken');

      assert.equal(reponse.status, 401);
    });

    it('renvoie les informations utilisateur si le token est valide', async () => {
      let tokenRecu;
      adaptateurJWT.decode = (token: string) => {
        tokenRecu = token
        return ({
          prenom: 'Jeanne',
          nom: 'Dupont',
        });
      }
      const reponse = await request(serveur)
        .get('/api/profil/verification-token-creation-compte?token=unBonToken');

      assert.equal(reponse.status, 200);
      assert.deepEqual(reponse.body, {
        prenom: 'Jeanne',
        nom: 'Dupont',
      });
      assert.equal(tokenRecu, 'unBonToken');
    });
  });
});
