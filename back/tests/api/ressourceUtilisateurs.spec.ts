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
        .send({
          email: 'jeanne.dupont@user.com',
          prenom: 'Jeanne',
          nom: 'Dupont',
          telephone: '0123456789',
          postes: ['RSSI'],
          siretEntite: '13002526500013',
          cguAcceptees: true,
          infolettreAcceptee: true,
        });

      const jeanne = await entrepotUtilisateur.parEmail(
        'jeanne.dupont@user.com'
      );
      assert.notEqual(jeanne, undefined);
      assert.equal(jeanne?.email, 'jeanne.dupont@user.com');
      assert.equal(jeanne?.prenom, 'Jeanne');
      assert.equal(jeanne?.nom, 'Dupont');
      assert.equal(jeanne?.telephone, '0123456789');
      assert.deepEqual(jeanne?.postes, ['RSSI']);
      assert.equal(jeanne?.siretEntite, '13002526500013');
      assert.equal(jeanne?.cguAcceptees, true);
      assert.equal(jeanne?.infolettreAcceptee, true);
    });

    it('aseptise les paramètres', async () => {
      const reponse = await request(serveur)
        .post('/api/utilisateurs')
        .send({
          email: '<jeanne.dupont@user.com',
          prenom: '<Jeanne',
          nom: '<Dupont',
          telephone: '<0123456789',
          postes: ['<RSSI'],
          siretEntite: '<13002526500013',
          cguAcceptees: true,
          infolettreAcceptee: true,
        });

      const jeanne = await entrepotUtilisateur.parEmail(
        '&lt;jeanne.dupont@user.com'
      );
      assert.notEqual(jeanne, undefined);
       assert.equal(jeanne?.email, '&lt;jeanne.dupont@user.com');
      assert.equal(jeanne?.prenom, '&lt;Jeanne');
      assert.equal(jeanne?.nom, '&lt;Dupont');
      assert.equal(jeanne?.telephone, '&lt;0123456789');
      assert.deepEqual(jeanne?.postes, ['&lt;RSSI']);
      assert.equal(jeanne?.siretEntite, '&lt;13002526500013');
    });
  });
});
