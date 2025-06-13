import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { Express } from 'express';
import { creeServeur } from '../../../src/api/msc';
import {
  configurationDeTestDuServeur,
  fauxAdaptateurJWT,
  fauxFournisseurDeChemin,
  fauxMiddleware,
} from '../fauxObjets';
import assert from 'node:assert';
import { EntrepotFavoriMemoire } from '../../persistance/entrepotFavoriMemoire';
import { encodeSession } from '../cookie';
import { fabriqueMiddleware } from '../../../src/api/middleware';
import { MiseAJourFavorisUtilisateur } from '../../../src/bus/miseAJourFavorisUtilisateur';
import {
  fabriqueBusPourLesTests,
  MockBusEvenement,
} from '../../bus/busPourLesTests';
import { hectorDurant, jeanneDupont } from '../objetsPretsALEmploi';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire';

describe('La ressource des services et ressources favoris', () => {
  let serveur: Express;
  let entrepotFavori: EntrepotFavoriMemoire;
  let cookieJeanneDupont: string;
  let busEvenements: MockBusEvenement;

  beforeEach(() => {
    entrepotFavori = new EntrepotFavoriMemoire();
    const entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    entrepotUtilisateur.ajoute(jeanneDupont);
    cookieJeanneDupont = encodeSession({
      email: jeanneDupont.email,
      token: 'token',
    });
    busEvenements = fabriqueBusPourLesTests();

    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      middleware: fabriqueMiddleware({
        adaptateurJWT: fauxAdaptateurJWT,
        fournisseurChemin: fauxFournisseurDeChemin,
      }),
      busEvenements,
      entrepotFavori,
      entrepotUtilisateur,
    });
  });

  describe('Sur requête POST', () => {
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

      await request(serveur).post('/api/favoris').send({ idItemCyber: '' });

      assert.equal(middelwareAppele, true);
    });

    it("retourne 400 si l'id est vide", async () => {
      const reponse = await request(serveur)
        .post('/api/favoris')
        .set('Cookie', [cookieJeanneDupont])
        .send({});

      await entrepotFavori.tousCeuxDeUtilisateur(jeanneDupont);

      assert.equal(reponse.status, 400);
    });

    it('sauvegarde un favori', async () => {
      const reponse = await request(serveur)
        .post('/api/favoris')
        .set('Cookie', [cookieJeanneDupont])
        .send({ idItemCyber: 'unId' });

      const ceuxDeUtilisateur =
        await entrepotFavori.tousCeuxDeUtilisateur(jeanneDupont);

      assert.equal(reponse.status, 201);
      assert.equal(ceuxDeUtilisateur.length, 1);
      assert.equal(ceuxDeUtilisateur[0].idItemCyber, 'unId');
      assert.deepEqual(ceuxDeUtilisateur[0].utilisateur, jeanneDupont);
    });

    it('aseptise le contenu du body et remet les slash en place', async () => {
      await request(serveur)
        .post('/api/favoris')
        .set('Cookie', [cookieJeanneDupont])
        .send({ idItemCyber: '/services/mon-service-cyber  ' });

      const ceuxDeUtilisateur =
        await entrepotFavori.tousCeuxDeUtilisateur(jeanneDupont);

      assert.equal(
        ceuxDeUtilisateur[0].idItemCyber,
        '/services/mon-service-cyber'
      );
    });
  });

  describe('Sur requête GET', () => {
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
        entrepotFavori,
      });

      await request(serveur).get('/api/favoris');

      assert.equal(middelwareAppele, true);
    });

    it("retourne les favoris de l'utilisateur connecté", async () => {
      await entrepotFavori.ajoute({
        idItemCyber: 'unId',
        utilisateur: jeanneDupont,
      });
      await entrepotFavori.ajoute({
        idItemCyber: 'unSecondId',
        utilisateur: jeanneDupont,
      });
      await entrepotFavori.ajoute({
        idItemCyber: 'unTroisiemeId',
        utilisateur: hectorDurant,
      });

      const reponse = await request(serveur)
        .get('/api/favoris')
        .set('Cookie', [cookieJeanneDupont]);

      assert.equal(reponse.status, 200);
      assert.equal(reponse.body.length, 2);
      assert.deepEqual(reponse.body, ['unId', 'unSecondId']);
    });

    it('publie un événement de mise à jour de la liste des favoris', async () => {
      await entrepotFavori.ajoute({
        idItemCyber: '/services/mon-super-service',
        utilisateur: jeanneDupont,
      });

      await request(serveur)
        .post('/api/favoris')
        .set('Cookie', [cookieJeanneDupont])
        .send({ idItemCyber: '/services/mon-service-service' });

      busEvenements.aRecuUnEvenement(MiseAJourFavorisUtilisateur);
      const evenement = busEvenements.recupereEvenement(
        MiseAJourFavorisUtilisateur
      );
      assert.equal(evenement!.utilisateur, jeanneDupont);
    });
  });
});
