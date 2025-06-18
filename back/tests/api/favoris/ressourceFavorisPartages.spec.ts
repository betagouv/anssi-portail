import { beforeEach, describe, it } from 'node:test';
import { Express } from 'express';
import { EntrepotFavoriMemoire } from '../../persistance/entrepotFavoriMemoire';
import { creeServeur } from '../../../src/api/msc';
import { configurationDeTestDuServeur } from '../fauxObjets';
import request from 'supertest';
import assert from 'node:assert';
import { EntrepotUtilisateur } from '../../../src/metier/entrepotUtilisateur';
import { jeanneDupont } from '../objetsPretsALEmploi';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire';
import { randomUUID } from 'node:crypto';

describe('La ressource des favoris partagés', () => {
  let serveur: Express;
  let entrepotFavori: EntrepotFavoriMemoire;
  let entrepotUtilisateur: EntrepotUtilisateur;
  let idListeFavoris: string | undefined;

  beforeEach(async () => {
    entrepotFavori = new EntrepotFavoriMemoire();
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepotFavori,
      entrepotUtilisateur,
    });
    await entrepotUtilisateur.ajoute(jeanneDupont);
    idListeFavoris = jeanneDupont.idListeFavoris;
    await entrepotFavori.ajoute({
      utilisateur: jeanneDupont,
      idItemCyber: '/services/mon-super-service',
    });
    await entrepotFavori.ajoute({
      utilisateur: jeanneDupont,
      idItemCyber: '/services/mon-autre-super-service',
    });
  });

  describe('sur requête GET', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get(
        `/api/favoris-partages/${idListeFavoris}`
      );

      assert.equal(reponse.statusCode, 200);
    });

    it("retourne les favoris de l'utilisateur qui a partagé sa liste", async () => {
      const reponse = await request(serveur).get(
        `/api/favoris-partages/${idListeFavoris}`
      );

      assert.equal(reponse.body.prenom, 'Jeanne');
      assert.deepEqual(reponse.body.favorisPartages, [
        '/services/mon-super-service',
        '/services/mon-autre-super-service',
      ]);
    });

    it('répond 404 si aucun utilisateur ne possède cet id de liste de favoris', async () => {
      const reponse = await request(serveur).get(
        `/api/favoris-partages/${randomUUID()}`
      );

      assert.equal(reponse.statusCode, 404);
    });

    it("retourne 400 si l'id de la liste de favoris n'est pas un uuid", async () => {
      const reponse = await request(serveur).get(
        `/api/favoris-partages/pasunuuid`
      );

      assert.equal(reponse.statusCode, 400);
    });
  });
});
