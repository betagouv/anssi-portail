import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { Express } from 'express';
import { creeServeur } from '../../../src/api/msc';
import {
  configurationDeTestDuServeur, fauxAdaptateurEnvironnement,
  fauxAdaptateurJWT,
  fauxFournisseurDeChemin,
  fauxMiddleware,
} from '../fauxObjets';
import assert from 'node:assert';
import { EntrepotFavoriMemoire } from '../../persistance/entrepotFavoriMemoire';
import { encodeSession } from '../cookie';
import { fabriqueMiddleware } from '../../../src/api/middleware';
import {
  fabriqueBusPourLesTests,
  MockBusEvenement,
} from '../../bus/busPourLesTests';
import { MiseAJourFavorisUtilisateur } from '../../../src/bus/miseAJourFavorisUtilisateur';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire';
import { jeanneDupont } from '../objetsPretsALEmploi';

describe('La ressource des services et ressources favoris', () => {
  let serveur: Express;
  let entrepotFavori: EntrepotFavoriMemoire;
  let entrepotUtilisateur: EntrepotUtilisateurMemoire;
  let cookieJeanneDupont: string;
  let busEvenements: MockBusEvenement;

  beforeEach(async () => {
    entrepotFavori = new EntrepotFavoriMemoire();
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    cookieJeanneDupont = encodeSession({
      email: jeanneDupont.email,
      token: 'token',
    });
    await entrepotUtilisateur.ajoute(jeanneDupont);
    busEvenements = fabriqueBusPourLesTests();

    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      middleware: fabriqueMiddleware({
        adaptateurJWT: fauxAdaptateurJWT,
        fournisseurChemin: fauxFournisseurDeChemin,
        adaptateurEnvironnement: fauxAdaptateurEnvironnement
      }),
      busEvenements,
      entrepotFavori,
      entrepotUtilisateur,
    });
  });

  describe('Sur requête DELETE', () => {
    it('utilise le middleware de verification de JWT', async () => {
      let middelwareAppele = false;
      serveur = creeServeur({
        ...configurationDeTestDuServeur,
        entrepotUtilisateur,
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
        utilisateur: jeanneDupont,
      });

      const reponse = await request(serveur)
        .delete(
          `/api/favoris/${encodeURIComponent('/services/mon-super-service')}`
        )
        .set('Cookie', [cookieJeanneDupont]);

      assert.equal(reponse.statusCode, 200);
      const favoris = await entrepotFavori.tousCeuxDeUtilisateur(jeanneDupont);
      assert.equal(favoris.length, 0);
    });

    it('aseptise le paramètre id', async () => {
      await entrepotFavori.ajoute({
        idItemCyber: 'unId&lt;truc',
        utilisateur: jeanneDupont,
      });

      await request(serveur)
        .delete(`/api/favoris/unId<truc`)
        .set('Cookie', [cookieJeanneDupont]);

      const favoris = await entrepotFavori.tousCeuxDeUtilisateur(jeanneDupont);
      assert.equal(favoris.length, 0);
    });

    it('publie un événement de mise à jour de la liste des favoris', async () => {
      await entrepotFavori.ajoute({
        idItemCyber: '/services/mon-super-service',
        utilisateur: jeanneDupont,
      });

      await request(serveur)
        .delete(
          `/api/favoris/${encodeURIComponent('/services/mon-super-service')}`
        )
        .set('Cookie', [cookieJeanneDupont]);

      busEvenements.aRecuUnEvenement(MiseAJourFavorisUtilisateur);
      const evenement = busEvenements.recupereEvenement(
        MiseAJourFavorisUtilisateur
      );
      assert.equal(evenement!.utilisateur, jeanneDupont);
    });
  });
});
