import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../../../src/api/msc/index.js';
import { QuestionnaireVraiFauxRéponseSoumise } from '../../../../src/bus/evenements/questionnaireVraiFauxReponseSoumise.js';
import { QuestionnaireVraiFauxTerminé } from '../../../../src/bus/evenements/questionnaireVraiFauxTermine.js';
import { fabriqueBusPourLesTests, MockBusEvenement } from '../../../bus/busPourLesTests.js';
import { EntrepôtQuestionVraieFausseMémoire } from '../../../persistance/entrepotQuestionVraieFausseMemoire.js';
import { EntrepôtRésultatTestVraiFauxMémoire } from '../../../persistance/entrepotResultatTestVraiFauxMemoire.js';
import { EntrepotUtilisateurMemoire } from '../../../persistance/entrepotUtilisateurMemoire.js';
import { encodeSession } from '../../cookie.js';
import { configurationDeTestDuServeur, fauxRapporteur } from '../../fauxObjets.js';
import { jeanneDupont } from '../../objetsPretsALEmploi.js';
import { questionVraieFausseDeTest } from './constructeurDeQuestionVraieFausse.js';

describe('La ressource des réponses aux questionnaire Vrai-Faux', () => {
  let serveur: Express;
  let busÉvénements: MockBusEvenement;
  let entrepôtQuestionVraieFausse: EntrepôtQuestionVraieFausseMémoire;
  let entrepôtRésultatTestVraiFaux: EntrepôtRésultatTestVraiFauxMémoire;

  beforeEach(async () => {
    busÉvénements = fabriqueBusPourLesTests(fauxRapporteur);
    entrepôtQuestionVraieFausse = new EntrepôtQuestionVraieFausseMémoire();
    entrepôtRésultatTestVraiFaux = new EntrepôtRésultatTestVraiFauxMémoire();
    await entrepôtQuestionVraieFausse.ajoute(
      questionVraieFausseDeTest().avecLIdQuestion('idQuestion1').avecIdéeReçueEstVraie(true).construis()
    );
    const entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    await entrepotUtilisateur.ajoute(jeanneDupont);
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      busEvenements: busÉvénements,
      entrepôtQuestionVraieFausse,
      entrepôtRésultatTestVraiFaux,
      entrepotUtilisateur,
    });
  });

  const posteUneRéponseValide = async () => {
    return request(serveur).post('/api/mini-tests/vrai-faux/reponses').send({
      idQuestion: 'idQuestion1',
      réponseUtilisateur: true,
      idCorrélation: '01a0a561-2416-726f-84c5-7566d613ce98',
      score: '3/6',
    });
  };

  describe('sur une requête POST', () => {
    it('répond un 201', async () => {
      const reponse = await posteUneRéponseValide();

      expect(reponse.status).toBe(HttpStatusCode.Created);
    });

    it("publie un événement lorsqu'une réponse est fournie", async () => {
      await posteUneRéponseValide();

      expect(busÉvénements.aRecuUnEvenement(QuestionnaireVraiFauxRéponseSoumise)).toBeTruthy();
    });

    it("publie un événement de questionnaire complété lorsqu'une la dernière réponse est fournie", async () => {
      await posteUneRéponseValide();

      expect(busÉvénements.aRecuUnEvenement(QuestionnaireVraiFauxTerminé)).toBeTruthy();
    });

    it("ne publie pas d'événement de questionnaire complété si la réponse fournie n'est pas la dernière", async () => {
      await entrepôtQuestionVraieFausse.ajoute(questionVraieFausseDeTest().avecLIdQuestion('idQuestion2').construis());

      await posteUneRéponseValide();

      expect(busÉvénements.naPasRecuDEvenement(QuestionnaireVraiFauxTerminé)).toBeTruthy();
    });

    it('publie les informations de l’utilisateur si elles sont disponibles', async () => {
      const cookieJeanneDupont = encodeSession({ email: jeanneDupont.email, token: 'token' });
      await request(serveur).post('/api/mini-tests/vrai-faux/reponses').set('Cookie', [cookieJeanneDupont]).send({
        idQuestion: 'idQuestion1',
        réponseUtilisateur: true,
        idCorrélation: '01a0a561-2416-726f-84c5-7566d613ce98',
        score: '3/6',
      });

      const événement = busÉvénements.recupereEvenement(QuestionnaireVraiFauxRéponseSoumise);

      expect(événement?.codeRegion).toBe('FR-971');
    });

    it('entrepose le résultat de l’utilisateur avec le score', async () => {
      const cookieJeanneDupont = encodeSession({ email: jeanneDupont.email, token: 'token' });
      await request(serveur).post('/api/mini-tests/vrai-faux/reponses').set('Cookie', [cookieJeanneDupont]).send({
        idQuestion: 'idQuestion1',
        réponseUtilisateur: true,
        idCorrélation: '01a0a561-2416-726f-84c5-7566d613ce98',
        score: '3/6',
      });

      expect((await entrepôtRésultatTestVraiFaux.tous())[0].score).toEqual('3/6');
    });

    describe('répond un 400', () => {
      it("si aucun identifiant de question n'est fourni", async () => {
        const reponse = await request(serveur).post('/api/mini-tests/vrai-faux/reponses').send({
          réponseUtilisateur: true,
          idCorrélation: '01a0a561-2416-726f-84c5-7566d613ce98',
          score: '3/6',
        });

        expect(reponse.status).toBe(HttpStatusCode.BadRequest);
      });

      it('si un identifiant de question est trop long', async () => {
        const reponse = await request(serveur)
          .post('/api/mini-tests/vrai-faux/reponses')
          .send({
            idQuestion: new Array(101).fill('a'),
            réponseUtilisateur: true,
            idCorrélation: '01a0a561-2416-726f-84c5-7566d613ce98',
            score: '3/6',
          });

        expect(reponse.status).toBe(HttpStatusCode.BadRequest);
      });

      it("si aucune réponse utilisateur n'est fournie", async () => {
        const reponse = await request(serveur).post('/api/mini-tests/vrai-faux/reponses').send({
          idQuestion: 'idQuestion1',
          idCorrélation: '01a0a561-2416-726f-84c5-7566d613ce98',
          score: '3/6',
        });

        expect(reponse.status).toBe(HttpStatusCode.BadRequest);
      });

      it("si aucun identifiant de corrélation n'est fourni", async () => {
        const reponse = await request(serveur).post('/api/mini-tests/vrai-faux/reponses').send({
          idQuestion: 'idQuestion1',
          réponseUtilisateur: true,
          score: '3/6',
        });

        expect(reponse.status).toBe(HttpStatusCode.BadRequest);
      });

      it("si un identifiant de corrélation n'est pas un uuidv7", async () => {
        const reponse = await request(serveur)
          .post('/api/mini-tests/vrai-faux/reponses')
          .send({
            idQuestion: 'idQuestion1',
            réponseUtilisateur: true,
            idCorrélation: new Array(36).fill('a'),
            score: '3/6',
          });

        expect(reponse.status).toBe(HttpStatusCode.BadRequest);
      });

      it('si un score est trop long', async () => {
        const reponse = await request(serveur).post('/api/mini-tests/vrai-faux/reponses').send({
          idQuestion: 'idQuestion1',
          réponseUtilisateur: true,
          idCorrélation: '01a0a561-2416-726f-84c5-7566d613ce98',
          score: '1234',
        });

        expect(reponse.status).toBe(HttpStatusCode.BadRequest);
      });
    });
  });
});
