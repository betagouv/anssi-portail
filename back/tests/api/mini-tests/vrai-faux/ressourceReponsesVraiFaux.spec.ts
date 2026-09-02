import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../../src/api/msc.js';
import { configurationDeTestDuServeur } from '../../fauxObjets.js';
import { fabriqueBusPourLesTests, MockBusEvenement } from '../../../bus/busPourLesTests.js';
import { RéponsesVraieFausseSoumise } from '../../../../src/bus/evenements/reponsesVraieFausseSoumise.js';

describe('La ressource des réponses aux questionnaire Vrai-Faux', () => {
  let serveur: Express;
  let busÉvénements: MockBusEvenement;

  beforeEach(() => {
    busÉvénements = fabriqueBusPourLesTests();
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      busEvenements: busÉvénements,
    });
  });

  const posteUneRéponseValide = async () => {
    return request(serveur).post('/api/mini-tests/vrai-faux/reponses').send({
      idQuestion: 'idQuestion1',
      réponseUtilisateur: true,
      idCorrélation: '1234567890',
    });
  };

  describe('sur une requête POST', () => {
    it('répond un 201', async () => {
      const reponse = await posteUneRéponseValide();

      assert.equal(reponse.status, HttpStatusCode.Created);
    });

    it("publie un événement lorsqu'une réponse est fournie", async () => {
      await posteUneRéponseValide();

      const événement = busÉvénements.recupereEvenement(RéponsesVraieFausseSoumise);
      assert.deepEqual(événement, {
        idQuestion: 'idQuestion1',
        idCorrélation: '1234567890',
        réponseCorrecte: true,
      });
    });

    describe('répond un 400', () => {
      it("si auncun identifiant de question n'est fourni", async () => {
        const reponse = await request(serveur).post('/api/mini-tests/vrai-faux/reponses').send({
          réponseUtilisateur: true,
          idCorrélation: '1234567890',
        });

        assert.equal(reponse.status, HttpStatusCode.BadRequest);
      });

      it("si auncune réponse utilisateur n'est fournie", async () => {
        const reponse = await request(serveur).post('/api/mini-tests/vrai-faux/reponses').send({
          idQuestion: 'idQuestion1',
          idCorrélation: '1234567890',
        });

        assert.equal(reponse.status, HttpStatusCode.BadRequest);
      });

      it("si auncun identifiant de corrélation n'est fourni", async () => {
        const reponse = await request(serveur).post('/api/mini-tests/vrai-faux/reponses').send({
          idQuestion: 'idQuestion1',
          réponseUtilisateur: true,
        });

        assert.equal(reponse.status, HttpStatusCode.BadRequest);
      });
    });
  });
});
