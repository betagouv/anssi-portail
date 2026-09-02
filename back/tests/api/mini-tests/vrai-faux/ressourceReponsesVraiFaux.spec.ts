import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../../src/api/msc.js';
import { QuestionnaireVraiFauxTerminé } from '../../../../src/bus/evenements/questionnaireVraiFauxTermine.js';
import { RéponsesVraieFausseSoumise } from '../../../../src/bus/evenements/reponsesVraieFausseSoumise.js';
import { fabriqueBusPourLesTests, MockBusEvenement } from '../../../bus/busPourLesTests.js';
import { EntrepôtQuestionVraieFausseMémoire } from '../../../persistance/entrepotQuestionVraieFausseMemoire.js';
import { configurationDeTestDuServeur } from '../../fauxObjets.js';
import { questionVraieFausseDeTest } from './constructeurDeQuestionVraieFausse.js';

describe('La ressource des réponses aux questionnaire Vrai-Faux', () => {
  let serveur: Express;
  let busÉvénements: MockBusEvenement;
  let entrepôtQuestionVraieFausse: EntrepôtQuestionVraieFausseMémoire;

  beforeEach(async () => {
    busÉvénements = fabriqueBusPourLesTests();
    entrepôtQuestionVraieFausse = new EntrepôtQuestionVraieFausseMémoire();
    await entrepôtQuestionVraieFausse.ajoute(
      questionVraieFausseDeTest().avecLIdQuestion('idQuestion1').avecIdéeReçueEstVraie(true).construis()
    );
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      busEvenements: busÉvénements,
      entrepôtQuestionVraieFausse,
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

      assert(busÉvénements.aRecuUnEvenement(RéponsesVraieFausseSoumise));
    });

    it("publie un événement de questionnaire complété lorsqu'une la dernière réponse est fournie", async () => {
      await posteUneRéponseValide();

      assert(busÉvénements.aRecuUnEvenement(QuestionnaireVraiFauxTerminé));
    });

    it("ne publie pas d'événement de questionnaire complété si la réponse fournie n'est pas la dernière", async () => {
      await entrepôtQuestionVraieFausse.ajoute(questionVraieFausseDeTest().avecLIdQuestion('idQuestion2').construis());

      await posteUneRéponseValide();

      assert(busÉvénements.naPasRecuDEvenement(QuestionnaireVraiFauxTerminé));
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
