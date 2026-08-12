import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc.js';
import { ParcoursRejoint } from '../../../src/bus/evenements/parcoursRejoint.js';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire.js';
import { encodeSession } from '../cookie.js';
import { configurationDeTestDuServeur } from '../fauxObjets.js';
import { MockBusEvenement } from '../../bus/busPourLesTests.js';
import { ConstructeurDUtilisateur } from './constructeurDUtilisateur.js';
import { Utilisateur } from '../../../src/metier/utilisateur.js';
import { ParcoursChangé } from '../../../src/bus/evenements/parcoursChange.js';

describe("La ressource du parcours de l'utilisateur", async () => {
  let serveur: Express;
  let cookie: string;
  let entrepotUtilisateur: EntrepotUtilisateurMemoire;
  let busEvenements: MockBusEvenement;
  let utilisateur: Utilisateur;

  beforeEach(async () => {
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    busEvenements = new MockBusEvenement();
    serveur = creeServeur({ ...configurationDeTestDuServeur, entrepotUtilisateur, busEvenements });
    utilisateur = new ConstructeurDUtilisateur().avecLEmail('check@yopmail.com').construis();
    await entrepotUtilisateur.ajoute(utilisateur);
    cookie = encodeSession({
      email: utilisateur.email,
      token: 'valide',
    });
  });

  describe('sur requête PUT', async () => {
    it('retourne 204', async () => {
      const reponse = await request(serveur).put('/parcours').set('Cookie', cookie).send({
        nom: 'complet',
      });

      assert.equal(reponse.status, 204);
    });

    it('retourne 400 si le corps de la requête ne respecte pas la structure attendue', async () => {
      const reponse = await request(serveur).put('/parcours').set('Cookie', cookie).send({ test: 'test' });

      assert.equal(reponse.status, 400);
    });

    it('peut rejoindre le parcours complet', async () => {
      await request(serveur).put('/parcours').set('Cookie', cookie).send({ nom: 'complet' });

      assert.equal(utilisateur.parcoursActuel(), 'complet');
      assert.deepEqual(entrepotUtilisateur.dernierUtilisateurMisAJour, utilisateur);
    });

    it('peut rejoindre le parcours allégé', async () => {
      await request(serveur).put('/parcours').set('Cookie', cookie).send({ nom: 'allégé' });

      assert.equal(utilisateur.parcoursActuel(), 'allégé');
      assert.deepEqual(entrepotUtilisateur.dernierUtilisateurMisAJour, utilisateur);
    });

    it('refuse la modification pour un utilisateur non connecté', async () => {
      const réponse = await request(serveur).put('/parcours').send({ nom: 'allégé' });

      assert.equal(réponse.status, 401);
    });

    it("émet un évènement ParcoursRejoint lorsqu'un parcours est rejoint", async () => {
      await request(serveur).put('/parcours').set('Cookie', cookie).send({ nom: 'complet' });

      const evenement = busEvenements.recupereEvenement(ParcoursRejoint);

      assert.equal(evenement?.emailHache, utilisateur.emailHache());
      assert.equal(evenement?.parcours, 'complet');
    });

    it("émet un évènement ParcoursChangé lorsqu'un parcours est changé", async () => {
      const utilisateurParcoursBasique = new ConstructeurDUtilisateur()
        .avecLEmail('basique@yopmail.com')
        .avecLeParcours('allégé')
        .construis();

      await entrepotUtilisateur.ajoute(utilisateurParcoursBasique);
      const cookieBasique = encodeSession({
        email: 'basique@yopmail.com',
        token: 'valide',
      });
      await request(serveur).put('/parcours').set('Cookie', cookieBasique).send({ nom: 'complet' });

      const evenement = busEvenements.recupereEvenement(ParcoursChangé);

      assert.equal(evenement?.emailHache, utilisateurParcoursBasique.emailHache());
      assert.equal(evenement?.parcoursPrécédent, 'allégé');
      assert.equal(evenement?.parcours, 'complet');
    });
  });
});
