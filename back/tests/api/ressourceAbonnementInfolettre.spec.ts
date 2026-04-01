import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../src/api/msc';
import { AdaptateurEmail } from '../../src/metier/adaptateurEmail';
import { MockBusEvenement } from '../bus/busPourLesTests';
import { configurationDeTestDuServeur } from './fauxObjets';

describe('La ressource d’abonnement à l’infolettre', () => {
  let serveur: Express;
  let adaptateurEmail: AdaptateurEmail;
  let busEvenements: MockBusEvenement;

  beforeEach(() => {
    adaptateurEmail = {
      creeContactBrevo: async () => {},
      envoieEmailBienvenue: async () => {},
      inscrisAInfolettre: async () => {},
    };
    busEvenements = new MockBusEvenement();
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      busEvenements,
      adaptateurEmail,
    });
  });

  describe('sur demande POST', () => {
    it('retourne un 201', async () => {
      const reponse = await request(serveur).post('/api/abonnement-infolettre').send();

      assert.equal(reponse.status, 201);
    });

    it('délègue la demande à l’adaptateur email', async () => {
      let emailInscrit: string | undefined;
      adaptateurEmail.inscrisAInfolettre = async (email: string) => {
        emailInscrit = email;
      };

      await request(serveur).post('/api/abonnement-infolettre').send({ email: 'emile@beta.gouv.fr' });

      assert.equal(emailInscrit, 'emile@beta.gouv.fr');
    });
  });
});
