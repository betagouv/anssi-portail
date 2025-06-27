import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../src/api/msc';
import {
  MessagerieInstantanee,
  RetourExperience,
} from '../../src/metier/messagerieInstantanee';
import { configurationDeTestDuServeur } from './fauxObjets';

describe("La ressource des retours d'expérience", () => {
  let serveur: Express;
  let messagerieInstantanee: MessagerieInstantanee;
  beforeEach(() => {
    messagerieInstantanee = {
      notifieUnRetourExperience: async () => {},
    };
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
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
  });
});
