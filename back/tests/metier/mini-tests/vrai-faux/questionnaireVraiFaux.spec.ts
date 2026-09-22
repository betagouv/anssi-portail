import { beforeEach, describe, expect, it } from 'vitest';
import { QuestionnaireVraiFauxRéponseSoumise } from '../../../../src/bus/evenements/questionnaireVraiFauxReponseSoumise.js';
import { QuestionnaireVraiFauxTerminé } from '../../../../src/bus/evenements/questionnaireVraiFauxTermine.js';
import { QuestionnaireVraiFaux } from '../../../../src/metier/mini-tests/vrai-faux/questionnaireVraiFaux.js';
import { ConstructeurDeQuestionVraieFausse } from '../../../api/mini-tests/vrai-faux/constructeurDeQuestionVraieFausse.js';
import { jeanneDupont, questionVraieFaussePME } from '../../../api/objetsPretsALEmploi.js';
import { fabriqueBusPourLesTests, MockBusEvenement } from '../../../bus/busPourLesTests.js';

describe('Un questionnaire vrai-faux', () => {
  const questionnaire = new QuestionnaireVraiFaux([
    questionVraieFaussePME,
    new ConstructeurDeQuestionVraieFausse().avecLIdQuestion('dernièreQuestion').construis(),
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

      const événement = busÉvénements.recupereEvenement(QuestionnaireVraiFauxRéponseSoumise);
      expect(événement).toEqual({
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

      const événement = busÉvénements.recupereEvenement(QuestionnaireVraiFauxRéponseSoumise);
      expect(événement).toEqual({
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
      await expect(
        questionnaire.évalueRéponse({
          busÉvénements,
          idCorrélation: 'idCorrélation',
          idQuestion: 'idInconnu',
          réponseUtilisateur: true,
        })
      ).rejects.toMatchObject({ message: 'réponse à une question inconnue : idInconnu' });
      expect(busÉvénements.naPasRecuDEvenement(QuestionnaireVraiFauxRéponseSoumise)).toBeTruthy();
    });

    it('signale la complétion du questionnaire si la réponse cible la dernière question', async () => {
      await questionnaire.évalueRéponse({
        busÉvénements,
        idCorrélation: 'idCorrélation',
        idQuestion: 'dernièreQuestion',
        réponseUtilisateur: true,
      });

      const événement = busÉvénements.recupereEvenement(QuestionnaireVraiFauxTerminé);
      expect(événement?.idCorrélation).toBe('idCorrélation');
    });

    it('ne signale pas la complétion du questionnaire si la réponse ne cible pas la dernière question', async () => {
      await questionnaire.évalueRéponse({
        busÉvénements,
        idCorrélation: 'idCorrélation',
        idQuestion: questionVraieFaussePME.idQuestion,
        réponseUtilisateur: true,
      });

      expect(busÉvénements.naPasRecuDEvenement(QuestionnaireVraiFauxTerminé)).toBeTruthy();
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

        const événement = busÉvénements.recupereEvenement(QuestionnaireVraiFauxRéponseSoumise);
        expect(événement?.email).toBe('jeanne.dupont@user.com');
        expect(événement?.codeSecteur).toBe('A');
        expect(événement?.codeRegion).toBe('FR-971');
        expect(événement?.codeTrancheEffectif).toBe('11');
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
        expect(événement?.email).toBe('jeanne.dupont@user.com');
        expect(événement?.codeSecteur).toBe('A');
        expect(événement?.codeRegion).toBe('FR-971');
        expect(événement?.codeTrancheEffectif).toBe('11');
      });
    });
  });
});
