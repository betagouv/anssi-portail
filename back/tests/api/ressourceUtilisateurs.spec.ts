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
  const donneesUtilisateur = {
    email: 'jeanne.dupont@user.com',
    prenom: 'Jeanne',
    nom: 'Dupont',
    telephone: '0123456789',
    domainesSpecialite: ['RSSI'],
    siretEntite: '13000766900018',
    cguAcceptees: true,
    infolettreAcceptee: true,
  };
  beforeEach(() => {
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepotUtilisateur,
    });
  });

  describe('sur demande POST', () => {
    it('répond 201', async () => {
      const reponse = await request(serveur).post('/api/utilisateurs').send(donneesUtilisateur);

      assert.equal(reponse.status, 201);
    });

    it("ajoute un utilisateur à l'entrepot", async () => {
      const reponse = await request(serveur)
        .post('/api/utilisateurs')
        .send(donneesUtilisateur);

      const jeanne = await entrepotUtilisateur.parEmail(
        'jeanne.dupont@user.com'
      );
      assert.notEqual(jeanne, undefined);
      assert.equal(jeanne?.email, 'jeanne.dupont@user.com');
      assert.equal(jeanne?.prenom, 'Jeanne');
      assert.equal(jeanne?.nom, 'Dupont');
      assert.equal(jeanne?.telephone, '0123456789');
      assert.deepEqual(jeanne?.domainesSpecialite, ['RSSI']);
      assert.equal(jeanne?.organisation.siret, '13000766900018');
      assert.equal(jeanne?.cguAcceptees, true);
      assert.equal(jeanne?.infolettreAcceptee, true);
    });

    it('aseptise les paramètres', async () => {
      const reponse = await request(serveur)
        .post('/api/utilisateurs')
        .send({
          email: '  jeanne.dupont@user.com',
          prenom: '<Jeanne',
          nom: '<Dupont',
          telephone: ' 0123456789',
          domainesSpecialite: [' RSSI'],
          siretEntite: ' 13000766900018',
          cguAcceptees: true,
          infolettreAcceptee: true,
        });

      const jeanne = await entrepotUtilisateur.parEmail(
        'jeanne.dupont@user.com'
      );
      assert.notEqual(jeanne, undefined);
      assert.equal(jeanne?.email, 'jeanne.dupont@user.com');
      assert.equal(jeanne?.prenom, '&lt;Jeanne');
      assert.equal(jeanne?.nom, '&lt;Dupont');
      assert.equal(jeanne?.telephone, '0123456789');
      assert.deepEqual(jeanne?.domainesSpecialite, ['RSSI']);
      assert.equal(jeanne?.organisation.siret, '13000766900018');
    });

    describe('concernant la validation des données', () => {
      it("valide l'email", async () => {
        const reponse = await request(serveur)
          .post('/api/utilisateurs')
          .send({
            ...donneesUtilisateur,
            email: 12,
          });
        assert.equal(reponse.status, 400);
        assert.equal(reponse.body.erreur, "L'email est invalide");
      });

      it("valide le prénom", async () => {
        const reponse = await request(serveur)
          .post('/api/utilisateurs')
          .send({
            ...donneesUtilisateur,
            prenom: '',
          });
        assert.equal(reponse.status, 400);
        assert.equal(reponse.body.erreur, "Le prénom est invalide");
      });

      it("valide le nom", async () => {
        const reponse = await request(serveur)
          .post('/api/utilisateurs')
          .send({
            ...donneesUtilisateur,
            nom: '',
          });
        assert.equal(reponse.status, 400);
        assert.equal(reponse.body.erreur, "Le nom est invalide");
      });

      it("valide le téléphone", async () => {
        const reponse = await request(serveur)
          .post('/api/utilisateurs')
          .send({
            ...donneesUtilisateur,
            telephone: 'ABCD',
          });
        assert.equal(reponse.status, 400);
        assert.equal(reponse.body.erreur, "Le téléphone est invalide");
      });

      it("valide les domaines de spécialité", async () => {
        const reponse = await request(serveur)
          .post('/api/utilisateurs')
          .send({
            ...donneesUtilisateur,
            domainesSpecialite: [],
          });
        assert.equal(reponse.status, 400);
        assert.equal(reponse.body.erreur, "Les domaines de spécialité sont invalides");
      });

      it("valide le siret", async () => {
        const reponse = await request(serveur)
          .post('/api/utilisateurs')
          .send({
            ...donneesUtilisateur,
            siretEntite: 'unMauvaisSiret',
          });
        assert.equal(reponse.status, 400);
        assert.equal(reponse.body.erreur, "Le siret est invalide");
      });

      it("valide l'acceptation des CGU", async () => {
        const reponse = await request(serveur)
          .post('/api/utilisateurs')
          .send({
            ...donneesUtilisateur,
            cguAcceptees: 12,
          });
        assert.equal(reponse.status, 400);
        assert.equal(reponse.body.erreur, "L'acceptation des CGU est invalide");
      });

      it("valide l'acceptation de l'infolettre", async () => {
        const reponse = await request(serveur)
          .post('/api/utilisateurs')
          .send({
            ...donneesUtilisateur,
            infolettreAcceptee: 12,
          });
        assert.equal(reponse.status, 400);
        assert.equal(reponse.body.erreur, "L'acceptation de l'infolettre est invalide");
      });
    });
  });
});
