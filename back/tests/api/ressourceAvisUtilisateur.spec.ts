import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import { beforeEach, describe, it, expect } from 'vitest';
import request from 'supertest';
import { creeServeur } from '../../src/api/msc.js';
import { AvisUtilisateurDonne } from '../../src/bus/evenements/avisUtilisateurDonne.js';
import { AvisUtilisateur, MessagerieInstantanee } from '../../src/metier/messagerieInstantanee.js';
import { MockBusEvenement } from '../bus/busPourLesTests.js';
import { configurationDeTestDuServeur, fausseMessagerieInstantanee } from './fauxObjets.js';

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
      ...fausseMessagerieInstantanee,
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
      const reponse = await request(serveur).post('/api/avis-utilisateur').send(avisUtilisateur);

      expect(reponse.status).toBe(HttpStatusCode.Created);
    });

    it('envoie les données à la messagerie instantannée', async () => {
      let avisUtilisateurEnvoye: AvisUtilisateur | undefined;
      messagerieInstantanee.notifieUnAvisUtilisateur = async (avisUtilisateur: AvisUtilisateur) => {
        avisUtilisateurEnvoye = avisUtilisateur;
      };

      await request(serveur).post('/api/avis-utilisateur').send(avisUtilisateur);

      expect(avisUtilisateurEnvoye).toEqual({
        niveauDeSatisfaction: 2,
        commentaire: 'Bonjour !',
        emailDeContact: 'mon.mail@mail.com',
      });
    });

    it('publie un évènement sur le bus', async () => {
      await request(serveur).post('/api/avis-utilisateur').send(avisUtilisateur);

      const evenement = busEvenements.recupereEvenement(AvisUtilisateurDonne);

      expect(evenement).toEqual({
        niveauDeSatisfaction: 2,
        emailDeContact: 'mon.mail@mail.com',
      });
    });

    it('renvoie une erreur si le niveau de satisfaction est invalide', async () => {
      const reponse = await request(serveur).post('/api/avis-utilisateur').send({ niveauDeSatisfaction: 0 });

      expect(reponse.status).toBe(HttpStatusCode.BadRequest);
      expect(reponse.body.fieldErrors.niveauDeSatisfaction[0]).toBe('Le niveau de satisfaction est invalide');
    });

    it('renvoie une erreur si le commentaire est vide', async () => {
      const reponse = await request(serveur)
        .post('/api/avis-utilisateur')
        .send({ ...avisUtilisateur, commentaire: '' });

      expect(reponse.status).toBe(HttpStatusCode.BadRequest);
      expect(reponse.body.fieldErrors.commentaire[0]).toBe('Le commentaire est requis');
    });

    it("renvoie une erreur si l'email est malformé", async () => {
      const reponse = await request(serveur)
        .post('/api/avis-utilisateur')
        .send({ ...avisUtilisateur, emailDeContact: 'pas un email' });

      expect(reponse.status).toBe(HttpStatusCode.BadRequest);
      expect(reponse.body.fieldErrors.emailDeContact[0]).toBe("L'email est invalide");
    });
  });
});
