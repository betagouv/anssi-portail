import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../src/api/msc';
import { RetourExperienceDonne } from '../../src/bus/evenements/retourExperienceDonne';
import {
  MessagerieInstantanee,
  RetourExperience,
} from '../../src/metier/messagerieInstantanee';
import { MockBusEvenement } from '../bus/busPourLesTests';
import { configurationDeTestDuServeur } from './fauxObjets';

describe("La ressource des retours d'expérience", () => {
  let serveur: Express;
  let messagerieInstantanee: MessagerieInstantanee;
  let busEvenements: MockBusEvenement;

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

  describe('sur demande de création', () => {
    it('retourne un 201', async () => {
      const reponse = await request(serveur)
        .post('/api/retours-experience')
        .send({
          raison: 'pas-clair',
        });
      assert.equal(reponse.status, 201);
    });

    it('envoie les données du questionnaire à mattermost', async () => {
      let retourExperienceEnvoye: RetourExperience | null = null;
      messagerieInstantanee.notifieUnRetourExperience = async (
        retourExperience: RetourExperience
      ) => {
        retourExperienceEnvoye = retourExperience;
      };

      await request(serveur).post('/api/retours-experience').send({
        raison: 'pas-clair',
        precision: 'flou',
        emailDeContact: 'mail@mail.com',
      });

      assert.deepEqual(retourExperienceEnvoye, {
        raison: 'pas-clair',
        precision: 'flou',
        emailDeContact: 'mail@mail.com',
      });
    });

    it('renvoie une erreur si la raison est invalide', async () => {
      let retourExperienceEnvoye: RetourExperience | null = null;
      messagerieInstantanee.notifieUnRetourExperience = async (
        retourExperience: RetourExperience
      ) => {
        retourExperienceEnvoye = retourExperience;
      };

      const reponse = await request(serveur)
        .post('/api/retours-experience')
        .send({
          raison: 'raison-invalide',
        });

      assert.equal(reponse.status, 400);
      assert.equal(reponse.body.erreur, 'La raison est invalide');
      assert.equal(retourExperienceEnvoye, null);
    });

    it('renvoie une erreur si le mail est invalide', async () => {
      const reponse = await request(serveur)
        .post('/api/retours-experience')
        .send({
          emailDeContact: 'email-invalide',
          raison: 'pas-clair',
        });

      assert.equal(reponse.status, 400);
      assert.equal(reponse.body.erreur, "L'email est invalide");
    });

    it("ignore l'email s'il est vide", async () => {
      const reponse = await request(serveur)
        .post('/api/retours-experience')
        .send({
          emailDeContact: '',
          raison: 'pas-clair',
        });

      assert.equal(reponse.status, 201);
    });

    it('aseptise les paramètres', async () => {
      let retourExperienceEnvoye: RetourExperience | null = null;
      messagerieInstantanee.notifieUnRetourExperience = async (
        retourExperience: RetourExperience
      ) => {
        retourExperienceEnvoye = retourExperience;
      };

      await request(serveur).post('/api/retours-experience').send({
        raison: 'pas-clair',
        precision: '  <>',
      });

      assert.equal(retourExperienceEnvoye!.precision, '&lt;&gt;');
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
        await request(serveur)
          .post('/api/retours-experience')
          .send(representation);

        busEvenements.aRecuUnEvenement(RetourExperienceDonne);
      });

      it("envoie la raison et l'email", async () => {
        await request(serveur)
          .post('/api/retours-experience')
          .send(representation);

        const evenement = busEvenements.recupereEvenement(
          RetourExperienceDonne
        );
        assert.equal(evenement!.raison, 'pas-clair');
        assert.equal(evenement!.emailDeContact, 'mail@mail.com');
      });
    });
  });
});
