import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../src/api/msc.js';
import { RetourExperienceDonne } from '../../src/bus/evenements/retourExperienceDonne.js';
import { MessagerieInstantanee, RetourExperience } from '../../src/metier/messagerieInstantanee.js';
import { MockBusEvenement } from '../bus/busPourLesTests.js';
import { configurationDeTestDuServeur, fausseMessagerieInstantanee } from './fauxObjets.js';

describe("La ressource des retours d'expérience", () => {
  let serveur: Express;
  let messagerieInstantanee: MessagerieInstantanee;
  let busEvenements: MockBusEvenement;

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

  describe('sur demande de création', () => {
    it('retourne un 201', async () => {
      const reponse = await request(serveur).post('/api/retours-experience').send({
        raison: 'pas-clair',
      });
      expect(reponse.status).toBe(HttpStatusCode.Created);
    });

    it('envoie les données du questionnaire à mattermost', async () => {
      let retourExperienceEnvoye: RetourExperience | null = null;
      messagerieInstantanee.notifieUnRetourExperience = async (retourExperience: RetourExperience) => {
        retourExperienceEnvoye = retourExperience;
      };

      await request(serveur).post('/api/retours-experience').send({
        raison: 'pas-clair',
        precision: 'flou',
        emailDeContact: 'mail@mail.com',
      });

      expect(retourExperienceEnvoye).toEqual({
        raison: 'pas-clair',
        precision: 'flou',
        emailDeContact: 'mail@mail.com',
      });
    });

    it('renvoie une erreur si la raison est invalide', async () => {
      let retourExperienceEnvoye: RetourExperience | null = null;
      messagerieInstantanee.notifieUnRetourExperience = async (retourExperience: RetourExperience) => {
        retourExperienceEnvoye = retourExperience;
      };

      const reponse = await request(serveur).post('/api/retours-experience').send({
        raison: 'raison-invalide',
      });

      expect(reponse.status).toBe(HttpStatusCode.BadRequest);
      expect(reponse.body.fieldErrors.raison[0]).toBe('La raison est invalide');
      expect(retourExperienceEnvoye).toBeNull();
    });

    it('renvoie une erreur si le mail est invalide', async () => {
      const reponse = await request(serveur).post('/api/retours-experience').send({
        emailDeContact: 'email-invalide',
        raison: 'pas-clair',
      });

      expect(reponse.status).toBe(HttpStatusCode.BadRequest);
      expect(reponse.body.fieldErrors.emailDeContact[0]).toBe("L'email est invalide");
    });

    it("ignore l'email s'il est vide", async () => {
      const reponse = await request(serveur).post('/api/retours-experience').send({
        emailDeContact: '',
        raison: 'pas-clair',
      });

      expect(reponse.status).toBe(HttpStatusCode.Created);
    });

    it('accepte la raison pas-decisionnaire', async () => {
      const reponse = await request(serveur).post('/api/retours-experience').send({
        raison: 'pas-decisionnaire',
      });

      expect(reponse.status).toBe(HttpStatusCode.Created);
    });

    describe("concernant la publication de l'événement", () => {
      let representation: Record<string, string>;

      beforeEach(() => {
        representation = {
          raison: 'pas-clair',
          precision: 'flou',
          emailDeContact: 'mail@mail.com',
        };
      });

      it('publie un événement sur le bus', async () => {
        await request(serveur).post('/api/retours-experience').send(representation);

        busEvenements.aRecuUnEvenement(RetourExperienceDonne);
      });

      it("envoie la raison et l'email", async () => {
        await request(serveur).post('/api/retours-experience').send(representation);

        const evenement = busEvenements.recupereEvenement(RetourExperienceDonne);
        expect(evenement!.raison).toBe('pas-clair');
        expect(evenement!.emailDeContact).toBe('mail@mail.com');
      });
    });
  });
});
