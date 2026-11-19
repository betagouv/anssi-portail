import { validate as uuidValidate } from 'uuid';
import { beforeEach, describe, expect, it } from 'vitest';
import { QuestionnaireVraiFauxRéponseSoumise } from '../../../../src/bus/evenements/questionnaireVraiFauxReponseSoumise.js';
import { QuestionnaireVraiFauxTerminé } from '../../../../src/bus/evenements/questionnaireVraiFauxTermine.js';
import { QuestionnaireVraiFaux } from '../../../../src/metier/mini-tests/vrai-faux/questionnaireVraiFaux.js';
import { fauxRapporteur } from '../../../api/fauxObjets.js';
import { ConstructeurDeQuestionVraieFausse } from '../../../api/mini-tests/vrai-faux/constructeurDeQuestionVraieFausse.js';
import { jeanneDupont, questionVraieFaussePME } from '../../../api/objetsPretsALEmploi.js';
import { fabriqueBusPourLesTests, MockBusEvenement } from '../../../bus/busPourLesTests.js';
import { EntrepôtRésultatTestVraiFauxMémoire } from '../../../persistance/entrepotResultatTestVraiFauxMemoire.js';

describe('Un questionnaire vrai-faux', () => {
  let entrepôtRésultatTestVraiFaux: EntrepôtRésultatTestVraiFauxMémoire;

  const questionnaire = new QuestionnaireVraiFaux([
    questionVraieFaussePME,
    new ConstructeurDeQuestionVraieFausse().avecLIdQuestion('dernièreQuestion').construis(),
  ]);
  let busÉvénements: MockBusEvenement;

  beforeEach(() => {
    entrepôtRésultatTestVraiFaux = new EntrepôtRésultatTestVraiFauxMémoire();

    busÉvénements = fabriqueBusPourLesTests(fauxRapporteur);
  });

  describe("lors de l'évaluation d'une réponse", () => {
    describe('anonyme', () => {
      it('reconnait une bonne réponse', async () => {
        await questionnaire.évalueRéponse({
          entrepôtRésultatTestVraiFaux,
          busÉvénements,
          idCorrélation: 'idCorrélation',
          idQuestion: 'idQuestion1',
          réponseUtilisateur: false,
          score: '4/6',
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
          entrepôtRésultatTestVraiFaux,
          busÉvénements,
          idCorrélation: 'idCorrélation',
          idQuestion: 'idQuestion1',
          réponseUtilisateur: true,
          score: '4/6',
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
            entrepôtRésultatTestVraiFaux,
            busÉvénements,
            idCorrélation: 'idCorrélation',
            idQuestion: 'idInconnu',
            réponseUtilisateur: true,
            score: '4/6',
          })
        ).rejects.toMatchObject({ message: 'réponse à une question inconnue : idInconnu' });
        expect(busÉvénements.naPasRecuDEvenement(QuestionnaireVraiFauxRéponseSoumise)).toBeTruthy();
      });

      it('signale la complétion du questionnaire si la réponse cible la dernière question', async () => {
        await questionnaire.évalueRéponse({
          entrepôtRésultatTestVraiFaux,
          busÉvénements,
          idCorrélation: 'idCorrélation',
          idQuestion: 'dernièreQuestion',
          réponseUtilisateur: true,
          score: '4/6',
        });

        const événement = busÉvénements.recupereEvenement(QuestionnaireVraiFauxTerminé);
        expect(événement?.idCorrélation).toBe('idCorrélation');
      });

      it('ne signale pas la complétion du questionnaire si la réponse ne cible pas la dernière question', async () => {
        await questionnaire.évalueRéponse({
          entrepôtRésultatTestVraiFaux,
          busÉvénements,
          idCorrélation: 'idCorrélation',
          idQuestion: questionVraieFaussePME.idQuestion,
          réponseUtilisateur: true,
          score: '4/6',
        });

        expect(busÉvénements.naPasRecuDEvenement(QuestionnaireVraiFauxTerminé)).toBeTruthy();
      });

      it("n'entrepose pas la complétion du test", async () => {
        await questionnaire.évalueRéponse({
          entrepôtRésultatTestVraiFaux,
          busÉvénements,
          idCorrélation: 'idCorrélation',
          idQuestion: 'dernièreQuestion',
          réponseUtilisateur: true,
          score: '1/6',
        });

        expect(await entrepôtRésultatTestVraiFaux.taille()).toEqual(0);
      });
    });

    describe("venant d'un utilisateur connecté", () => {
      it("enrichit l'événement de réponse avec les données utilisateur", async () => {
        await questionnaire.évalueRéponse({
          entrepôtRésultatTestVraiFaux,
          busÉvénements,
          idCorrélation: 'idCorrélation',
          idQuestion: 'idQuestion1',
          réponseUtilisateur: false,
          utilisateur: jeanneDupont,
          score: '4/6',
        });

        const événement = busÉvénements.recupereEvenement(QuestionnaireVraiFauxRéponseSoumise);
        expect(événement?.email).toBe('jeanne.dupont@user.com');
        expect(événement?.codeSecteur).toBe('A');
        expect(événement?.codeRegion).toBe('FR-971');
        expect(événement?.codeTrancheEffectif).toBe('11');
      });

      it("enrichit l'événement de complétion du questionnaire avec les données utilisateur", async () => {
        await questionnaire.évalueRéponse({
          entrepôtRésultatTestVraiFaux,
          busÉvénements,
          idCorrélation: 'idCorrélation',
          idQuestion: 'dernièreQuestion',
          réponseUtilisateur: true,
          utilisateur: jeanneDupont,
          score: '6/6',
        });

        const événement = busÉvénements.recupereEvenement(QuestionnaireVraiFauxTerminé);
        expect(événement?.email).toBe('jeanne.dupont@user.com');
        expect(événement?.codeSecteur).toBe('A');
        expect(événement?.codeRegion).toBe('FR-971');
        expect(événement?.codeTrancheEffectif).toBe('11');
      });

      it('entrepose la complétion du test avec son score', async () => {
        await questionnaire.évalueRéponse({
          entrepôtRésultatTestVraiFaux,
          busÉvénements,
          idCorrélation: 'idCorrélation',
          idQuestion: 'dernièreQuestion',
          réponseUtilisateur: true,
          utilisateur: jeanneDupont,
          score: '1/6',
        });

        expect(await entrepôtRésultatTestVraiFaux.taille()).toEqual(1);

        const résultatDeTest = (await entrepôtRésultatTestVraiFaux.tous())[0];
        expect(résultatDeTest).toBeDefined();
        expect(résultatDeTest.utilisateur).toEqual(jeanneDupont);
        expect(résultatDeTest.score).toEqual('1/6');
        expect(uuidValidate(résultatDeTest.id)).toBeTruthy();
      });
    });
  });
});
