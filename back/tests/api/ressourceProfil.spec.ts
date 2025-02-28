import { beforeEach, describe, it } from 'node:test';
import { Express } from 'express';
import assert from 'node:assert';
import {
  fauxAdaptateurJWT,
  fauxAdaptateurOIDC,
  fauxFournisseurDeChemin,
} from './fauxObjets';
import { creeServeur } from '../../src/api/msc';
import request from 'supertest';
import { fabriqueMiddleware } from '../../src/api/middleware';
import { encodeSession } from './cookie';

describe('La ressource Profil', () => {
  let serveur: Express;

  beforeEach(() => {
    serveur = creeServeur({
      fournisseurChemin: fauxFournisseurDeChemin,
      middleware: fabriqueMiddleware(),
      adaptateurOIDC: fauxAdaptateurOIDC,
      adaptateurJWT: fauxAdaptateurJWT,
    });
  });

  describe('sur demande GET', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/profil');

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
        .get('/profil')
        .set('Cookie', [cookie]);

      assert.equal(reponse.body.nom, 'Dupont');
      assert.equal(reponse.body.prenom, 'Jeanne');
      assert.equal(reponse.body.email, 'jeanne.dupont');
      assert.equal(reponse.body.siret, '1234');
    });
  });
});
