import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../../src/api/msc.js';
import { TestExpositionRéalisé } from '../../../../src/bus/evenements/TestExpositionRealise.js';
import { MockBusEvenement } from '../../../bus/busPourLesTests.js';
import { configurationDeTestDuServeur } from '../../fauxObjets.js';

describe('La ressource des tests d’exposition', () => {
  let serveur: Express;
  let busEvenements: MockBusEvenement;
  const corpsParDéfaut = { typeOrganisation: 'collectivite', secteur: 'sante', facteursAggravant: [] };

  beforeEach(() => {
    busEvenements = new MockBusEvenement();
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      busEvenements,
    });
  });

  describe('sur requête POST', () => {
    it('répond 201', async () => {
      const réponse = await request(serveur).post('/api/mini-tests/exposition/tests').send(corpsParDéfaut);

      assert.equal(réponse.status, HttpStatusCode.Created);
    });

    it('émet un événement sur le bus', async () => {
      await request(serveur).post('/api/mini-tests/exposition/tests').send(corpsParDéfaut);

      assert(busEvenements.aRecuUnEvenement(TestExpositionRéalisé));
    });

    it('trace les réponses', async () => {
      await request(serveur)
        .post('/api/mini-tests/exposition/tests')
        .send({
          typeOrganisation: 'association',
          secteur: 'energie',
          facteursAggravant: ['subco', 'rd'],
        });

      const événement = busEvenements.recupereEvenement(TestExpositionRéalisé);
      assert.notEqual(événement, undefined);
      assert.deepEqual(événement, {
        typeOrganisation: 'association',
        secteur: 'energie',
        facteursAggravant: ['subco', 'rd'],
      });
    });

    describe('répond un 400', () => {
      it('si un type d’organisation est inconnu', async () => {
        const reponse = await request(serveur).post('/api/mini-tests/exposition/tests').send({
          typeOrganisation: 'inconnu',
          secteur: 'energie',
          facteursAggravant: [],
        });

        assert.equal(reponse.status, HttpStatusCode.BadRequest);
      });

      it('si un secteur est inconnu', async () => {
        const reponse = await request(serveur).post('/api/mini-tests/exposition/tests').send({
          typeOrganisation: 'grand-groupe',
          secteur: 'inconnu',
          facteursAggravant: [],
        });

        assert.equal(reponse.status, HttpStatusCode.BadRequest);
      });

      it('si un facteur aggravant est inconnu', async () => {
        const reponse = await request(serveur)
          .post('/api/mini-tests/exposition/tests')
          .send({
            typeOrganisation: 'grand-groupe',
            secteur: 'sante',
            facteursAggravant: ['inconnu'],
          });

        assert.equal(reponse.status, HttpStatusCode.BadRequest);
      });
    });
  });
});
