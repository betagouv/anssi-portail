import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc.js';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire.js';
import { encodeSession } from '../cookie.js';
import { configurationDeTestDuServeur } from '../fauxObjets.js';
import { jeanneDupont } from '../objetsPretsALEmploi.js';

describe("La ressource du parcours de l'utilisateur", async () => {
  let serveur: Express;
  let cookieDeJeanneDupont: string;
  let entrepotUtilisateur: EntrepotUtilisateurMemoire;

  beforeEach(async () => {
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    serveur = creeServeur({ ...configurationDeTestDuServeur, entrepotUtilisateur });

    await entrepotUtilisateur.ajoute(jeanneDupont);
    cookieDeJeanneDupont = encodeSession({
      email: jeanneDupont.email,
      token: 'valide',
    });
  });

  describe('sur requête PUT', async () => {
    it('retourne 204', async () => {
      const reponse = await request(serveur).put('/parcours').set('Cookie', cookieDeJeanneDupont).send({
        nom: 'complet',
      });

      assert.equal(reponse.status, 204);
    });

    it('retourne 400 si le corps de la requête ne respecte pas la structure attendue', async () => {
      const reponse = await request(serveur)
        .put('/parcours')
        .set('Cookie', cookieDeJeanneDupont)
        .send({ test: 'test' });

      assert.equal(reponse.status, 400);
    });

    it('peut rejoindre le parcours complet', async () => {
      await request(serveur).put('/parcours').set('Cookie', cookieDeJeanneDupont).send({ nom: 'complet' });

      assert.equal(jeanneDupont.parcoursActuel(), 'complet');
      assert.deepEqual(entrepotUtilisateur.dernierUtilisateurMisAJour, jeanneDupont);
    });

    it('peut rejoindre le parcours allégé', async () => {
      await request(serveur).put('/parcours').set('Cookie', cookieDeJeanneDupont).send({ nom: 'allégé' });

      assert.equal(jeanneDupont.parcoursActuel(), 'allégé');
      assert.deepEqual(entrepotUtilisateur.dernierUtilisateurMisAJour, jeanneDupont);
    });

    it('refuse la modification pour un utilisateur non connecté', async () => {
      const réponse = await request(serveur).put('/parcours').send({ nom: 'allégé' });

      assert.equal(réponse.status, 401);
    });
  });
});
