import { beforeEach, describe, it } from 'node:test';
import { Express } from 'express';
import assert from 'node:assert';
import { configurationDeTestDuServeur } from './fauxObjets';
import { creeServeur } from '../../src/api/msc';
import request from 'supertest';
import { EntrepotUtilisateurMemoire } from '../persistance/entrepotUtilisateurMemoire';

describe('La ressource utilisateur', () => {
  let serveur: Express;
  let entrepotUtilisateur: EntrepotUtilisateurMemoire;

  beforeEach(() => {
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepotUtilisateur,
    });
  });

  describe('sur demande POST', () => {
    it('répond 201', async () => {
      const reponse = await request(serveur).post('/api/utilisateurs');

      assert.equal(reponse.status, 201);
    });

    it("ajoute un utilisateur à l'entrepot", async () => {
      const reponse = await request(serveur)
        .post('/api/utilisateurs')
        .send({ email: 'jeanne.dupont@user.com' });

      const jeanne = await entrepotUtilisateur.parEmail(
        'jeanne.dupont@user.com'
      );
      assert.notEqual(jeanne, undefined);
    });

    it('aseptise les paramètres', async()=> {
       const reponse = await request(serveur)
        .post('/api/utilisateurs')
        .send({ email: '<jeanne.dupont@user.com' });

        const jeanne = await entrepotUtilisateur.parEmail(
        '&lt;jeanne.dupont@user.com'
      );
      assert.notEqual(jeanne, undefined);
    })
  });
});
