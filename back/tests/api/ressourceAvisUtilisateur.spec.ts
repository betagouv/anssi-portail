import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../src/api/msc';
import { AvisUtilisateurDonne } from '../../src/bus/evenements/avisUtilisateurDonne';
import {
  AvisUtilisateur,
  MessagerieInstantanee,
} from '../../src/metier/messagerieInstantanee';
import { MockBusEvenement } from '../bus/busPourLesTests';
import { configurationDeTestDuServeur } from './fauxObjets';

describe('La ressource avis utilisateur', () => {
  let serveur: Express;
  let messagerieInstantanee: MessagerieInstantanee;
  let busEvenements: MockBusEvenement;
  const avisUtilisateur = {
    niveauDeSatisfaction: 2,
    commentaire: 'Bonjour !',
    emailDeContact: 'mon.mail@mail.com',
  };
  beforeEach(() => {
    messagerieInstantanee = {
      notifieUnRetourExperience: async () => {},
      notifieUnAvisUtilisateur: async () => {},
    };
    busEvenements = new MockBusEvenement();
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      busEvenements,
      messagerieInstantanee,
    });
  });

  describe('sur demande POST', () => {
    it('retourne un 201', async () => {
      const reponse = await request(serveur)
        .post('/api/avis-utilisateur')
        .send(avisUtilisateur);

      assert.equal(reponse.status, 201);
    });

    it('envoie les données à la messagerie instantannée', async () => {
      let avisUtilisateurEnvoye: AvisUtilisateur | undefined;
      messagerieInstantanee.notifieUnAvisUtilisateur = async (
        avisUtilisateur: AvisUtilisateur
      ) => {
        avisUtilisateurEnvoye = avisUtilisateur;
      };

      await request(serveur)
        .post('/api/avis-utilisateur')
        .send(avisUtilisateur);

      assert.deepEqual(avisUtilisateurEnvoye, {
        niveauDeSatisfaction: 2,
        commentaire: 'Bonjour !',
        emailDeContact: 'mon.mail@mail.com',
      });
    });

    it('publie un évènement sur le bus', async () => {
      await request(serveur)
        .post('/api/avis-utilisateur')
        .send(avisUtilisateur);

      const evenement = busEvenements.recupereEvenement(AvisUtilisateurDonne);

      assert.deepEqual(evenement, {
        niveauDeSatisfaction: 2,
        emailDeContact: 'mon.mail@mail.com',
      });
    });

    it('renvoie une erreur si le niveau de satisfaction est invalide', async () => {
      const reponse = await request(serveur)
        .post('/api/avis-utilisateur')
        .send({ niveauDeSatisfaction: 0 });

      assert.equal(reponse.status, 400);
      assert.equal(
        reponse.body.erreur,
        'Le niveau de satisfaction est invalide'
      );
    });

    it('renvoie une erreur si le commentaire est vide', async () => {
      const reponse = await request(serveur)
        .post('/api/avis-utilisateur')
        .send({ ...avisUtilisateur, commentaire: '' });

      assert.equal(reponse.status, 400);
      assert.equal(reponse.body.erreur, 'Le commentaire est requis');
    });

    it("renvoie une erreur si l'email est malformé", async () => {
      const reponse = await request(serveur)
        .post('/api/avis-utilisateur')
        .send({ ...avisUtilisateur, emailDeContact: 'pas un email' });

      assert.equal(reponse.status, 400);
      assert.equal(reponse.body.erreur, "L'email est invalide");
    });

    it('asseptise le champ commentaire', async () => {
      let avisUtilisateurEnvoye: AvisUtilisateur | undefined;
      messagerieInstantanee.notifieUnAvisUtilisateur = async (
        avisUtilisateur: AvisUtilisateur
      ) => {
        avisUtilisateurEnvoye = avisUtilisateur;
      };

      await request(serveur)
        .post('/api/avis-utilisateur')
        .send({ ...avisUtilisateur, commentaire: '<span>Bonjour !</span>' });

      assert.deepEqual(avisUtilisateurEnvoye, {
        niveauDeSatisfaction: 2,
        commentaire: '&lt;span&gt;Bonjour !&lt;&#x2F;span&gt;',
        emailDeContact: 'mon.mail@mail.com',
      });
    });
  });
});
