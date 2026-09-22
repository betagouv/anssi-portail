import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../src/api/msc.js';
import { AdaptateurEmail } from '../../src/metier/adaptateurEmail.js';
import { MockBusEvenement } from '../bus/busPourLesTests.js';
import { configurationDeTestDuServeur, fauxAdaptateurEmail } from './fauxObjets.js';

describe('La ressource d’abonnement à l’infolettre', () => {
  let serveur: Express;
  let adaptateurEmail: AdaptateurEmail;
  let busEvenements: MockBusEvenement;

  beforeEach(() => {
    adaptateurEmail = {
      ...fauxAdaptateurEmail,
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
      const reponse = await request(serveur).post('/api/abonnement-infolettre').send({ email: 'emile@beta.gouv.fr' });

      expect(reponse.status).toBe(HttpStatusCode.Created);
    });

    it('délègue la demande à l’adaptateur email', async () => {
      let emailInscrit: string | undefined;
      adaptateurEmail.inscrisAInfolettre = async (email: string) => {
        emailInscrit = email;
      };

      await request(serveur).post('/api/abonnement-infolettre').send({ email: 'emile@beta.gouv.fr' });

      expect(emailInscrit).toBe('emile@beta.gouv.fr');
    });

    it("renvoie une erreur si l'email est manquant", async () => {
      const reponse = await request(serveur).post('/api/abonnement-infolettre').send({});

      expect(reponse.status).toBe(HttpStatusCode.BadRequest);
    });

    it("renvoie une erreur si l'email est malformé", async () => {
      const reponse = await request(serveur).post('/api/abonnement-infolettre').send({ email: 'pas un email' });

      expect(reponse.status).toBe(HttpStatusCode.BadRequest);
    });
  });
});
