import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { RéponseVraieFausseSoumise } from '../../../../src/bus/evenements/reponseVraieFausseSoumise.js';
import { QuestionnaireVraiFaux } from '../../../../src/metier/mini-tests/vrai-faux/questionnaireVraiFaux.js';
import { jeanneDupont, questionVraieFaussePME } from '../../../api/objetsPretsALEmploi.js';
import { fabriqueBusPourLesTests, MockBusEvenement } from '../../../bus/busPourLesTests.js';
import { QuestionnaireVraiFauxTerminé } from '../../../../src/bus/evenements/questionnaireVraiFauxTermine.js';
import { ConstructeurDeQuestionVraieFause } from '../../../api/mini-tests/vrai-faux/constructeurDeQuestionVraieFausse.js';

describe('Un questionnaire vrai-faux', () => {
  const questionnaire = new QuestionnaireVraiFaux([
    questionVraieFaussePME,
    new ConstructeurDeQuestionVraieFause().avecLIdQuestion('dernièreQuestion').construis(),
  ]);
  let busÉvénements: MockBusEvenement;

  beforeEach(() => {
    busÉvénements = fabriqueBusPourLesTests();
  });

  describe("lors de l'évaluation d'une réponse", () => {
    it('reconnait une bonne réponse', async () => {
      await questionnaire.évalueRéponse({
        busÉvénements,
        idCorrélation: 'idCorrélation',
        idQuestion: 'idQuestion1',
        réponseUtilisateur: false,
      });

      const événement = busÉvénements.recupereEvenement(RéponseVraieFausseSoumise);
      assert.deepEqual(événement, {
        idCorrélation: 'idCorrélation',
        idQuestion: 'idQuestion1',
        réponseCorrecte: true,
        email: undefined,
        codeRegion: undefined,
        codeSecteur: undefined,
        codeTrancheEffectif: undefined,
      });
    });

    it('reconnait une mauvaise réponse', async () => {
      await questionnaire.évalueRéponse({
        busÉvénements,
        idCorrélation: 'idCorrélation',
        idQuestion: 'idQuestion1',
        réponseUtilisateur: true,
      });

      const événement = busÉvénements.recupereEvenement(RéponseVraieFausseSoumise);
      assert.deepEqual(événement, {
        idCorrélation: 'idCorrélation',
        idQuestion: 'idQuestion1',
        réponseCorrecte: false,
        email: undefined,
        codeRegion: undefined,
        codeSecteur: undefined,
        codeTrancheEffectif: undefined,
      });
    });

    it('lève une erreur si la question est inconnue', async () => {
      await assert.rejects(
        questionnaire.évalueRéponse({
          busÉvénements,
          idCorrélation: 'idCorrélation',
          idQuestion: 'idInconnu',
          réponseUtilisateur: true,
        }),
        {
          message: 'réponse à une question inconnue : idInconnu',
        }
      );
      assert(busÉvénements.naPasRecuDEvenement(RéponseVraieFausseSoumise));
    });

    it('signale la complétion du questionnaire si la réponse cible la dernière question', async () => {
      await questionnaire.évalueRéponse({
        busÉvénements,
        idCorrélation: 'idCorrélation',
        idQuestion: 'dernièreQuestion',
        réponseUtilisateur: true,
      });

      const événement = busÉvénements.recupereEvenement(QuestionnaireVraiFauxTerminé);
      assert.equal(événement?.idCorrélation, 'idCorrélation');
    });

    it('ne signale pas la complétion du questionnaire si la réponse ne cible pas la dernière question', async () => {
      await questionnaire.évalueRéponse({
        busÉvénements,
        idCorrélation: 'idCorrélation',
        idQuestion: questionVraieFaussePME.idQuestion,
        réponseUtilisateur: true,
      });

      assert(busÉvénements.naPasRecuDEvenement(QuestionnaireVraiFauxTerminé));
    });

    describe("venant d'un utilisateur connu", () => {
      it("enrichit l'événement de réponse avec les données utilisateur", async () => {
        await questionnaire.évalueRéponse({
          busÉvénements,
          idCorrélation: 'idCorrélation',
          idQuestion: 'idQuestion1',
          réponseUtilisateur: false,
          utilisateur: jeanneDupont,
        });

        const événement = busÉvénements.recupereEvenement(RéponseVraieFausseSoumise);
        assert.equal(événement?.email, 'jeanne.dupont@user.com');
        assert.equal(événement?.codeSecteur, 'A');
        assert.equal(événement?.codeRegion, 'FR-971');
        assert.equal(événement?.codeTrancheEffectif, '11');
      });

      it("enrichit l'événement de complétion du questionnaire avec les données utilisateur", async () => {
        await questionnaire.évalueRéponse({
          busÉvénements,
          idCorrélation: 'idCorrélation',
          idQuestion: 'dernièreQuestion',
          réponseUtilisateur: true,
          utilisateur: jeanneDupont,
        });

        const événement = busÉvénements.recupereEvenement(QuestionnaireVraiFauxTerminé);
        assert.equal(événement?.email, 'jeanne.dupont@user.com');
        assert.equal(événement?.codeSecteur, 'A');
        assert.equal(événement?.codeRegion, 'FR-971');
        assert.equal(événement?.codeTrancheEffectif, '11');
      });
    });
  });
});
