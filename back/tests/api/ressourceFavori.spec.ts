import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { Express } from 'express';
import { creeServeur } from '../../src/api/msc';
import {
  configurationDeTestDuServeur,
  fauxAdaptateurJWT,
  fauxMiddleware,
} from './fauxObjets';
import assert from 'node:assert';
import { EntrepotFavoriMemoire } from '../persistance/entrepotFavoriMemoire';
import { encodeSession } from './cookie';
import { fabriqueMiddleware } from '../../src/api/middleware';

describe('La ressource des services et ressources favoris', () => {
  let serveur: Express;
  let entrepotFavori: EntrepotFavoriMemoire;
  let cookieJeanneDupont: string;

  beforeEach(() => {
    entrepotFavori = new EntrepotFavoriMemoire();
    cookieJeanneDupont = encodeSession({
      email: 'jeanne.dupont@mail.com',
      token: 'token',
    });
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      middleware: fabriqueMiddleware({ adaptateurJWT: fauxAdaptateurJWT }),
      entrepotFavori,
    });
  });

  describe('Sur requête DELETE', () => {
    it('utilise le middleware de verification de JWT', async () => {
      let middelwareAppele = false;
      serveur = creeServeur({
        ...configurationDeTestDuServeur,
        middleware: {
          ...fauxMiddleware,
          verifieJWT: async (_, __, suite) => {
            middelwareAppele = true;
            suite();
          },
        },
      });

      await request(serveur).delete(
        `/api/favoris/${encodeURIComponent('/services/mon-super-service')}`
      );

      assert.equal(middelwareAppele, true);
    });

    it("supprime le favori de l'entrepot", async () => {
      await entrepotFavori.ajoute({
        idItemCyber: '/services/mon-super-service',
        emailUtilisateur: 'jeanne.dupont@mail.com',
      });

      await request(serveur)
        .delete(
          `/api/favoris/${encodeURIComponent('/services/mon-super-service')}`
        )
        .set('Cookie', [cookieJeanneDupont]);

      const favoris = await entrepotFavori.tousCeuxDeUtilisateur(
        'jeanne.dupont@mail.com'
      );
      assert.equal(favoris.length, 0);
    });

    it('aseptise le paramètre id', async () => {
      await entrepotFavori.ajoute({
        idItemCyber: 'unId&lt;truc',
        emailUtilisateur: 'jeanne.dupont@mail.com',
      });

      await request(serveur)
        .delete(`/api/favoris/unId<truc`)
        .set('Cookie', [cookieJeanneDupont]);

      const favoris = await entrepotFavori.tousCeuxDeUtilisateur(
        'jeanne.dupont@mail.com'
      );
      assert.equal(favoris.length, 0);
    });
  });
});
