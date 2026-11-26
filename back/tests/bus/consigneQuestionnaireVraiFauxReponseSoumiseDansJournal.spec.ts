import { describe, expect, it } from 'vitest';
import { consigneQuestionnaireVraiFauxReponseSoumiseDansJournal } from '@bus/consigneQuestionnaireVraiFauxReponseSoumiseDansJournal.js';
import { QuestionnaireVraiFauxRéponseSoumise } from '@bus/evenements/questionnaireVraiFauxReponseSoumise.js';
import { AdaptateurHachage } from '@infra/adaptateurHachage.js';
import { AdaptateurJournal } from '@infra/adaptateurJournal.js';
import { fauxAdaptateurHachage } from '../api/fauxObjets.js';
import { fabriqueAdaptateurHorloge } from '../infra/adaptateurHorlogePourLesTests.js';

describe('L’abonnement qui consigne une réponse à une question vraie/faux dans le journal', () => {
  it('consigne un évènement QuestionnaireVraiFauxRéponseSoumise pour un utilisateur identifié', async () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge = fabriqueAdaptateurHorloge('2025-03-10T00:00:00Z');
    const adaptateurHachage: AdaptateurHachage = {
      ...fauxAdaptateurHachage,
      hache: (valeur) => `${valeur}-hacheHMAC`,
    };

    await consigneQuestionnaireVraiFauxReponseSoumiseDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    })(
      new QuestionnaireVraiFauxRéponseSoumise({
        idCorrélation: 'id-correlation',
        idQuestion: 'q1',
        réponseCorrecte: true,
        email: 'u1@example.com',
        codeRegion: 'FR-IDF',
        codeSecteur: 'A',
        codeTrancheEffectif: '00',
      })
    );

    expect(evenementRecu).toEqual({
      type: 'QUESTIONNAIRE_VRAI_FAUX_REPONSE_SOUMISE',
      donnees: {
        idCorrélation: 'id-correlation',
        idQuestion: 'q1',
        réponseCorrecte: true,
        idUtilisateur: 'u1@example.com-hacheHMAC',
        codeRegion: 'FR-IDF',
        codeSecteur: 'A',
        codeTrancheEffectif: '00',
      },
      date: Temporal.Instant.from('2025-03-10T00:00:00Z'),
    });
  });

  it('consigne un évènement QuestionnaireVraiFauxRéponseSoumise pour un utilisateur anonyme', async () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge = fabriqueAdaptateurHorloge('2025-03-10T00:00:00Z');
    const adaptateurHachage: AdaptateurHachage = {
      ...fauxAdaptateurHachage,
      hache: (valeur) => `${valeur}-hacheHMAC`,
    };

    await consigneQuestionnaireVraiFauxReponseSoumiseDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    })(
      new QuestionnaireVraiFauxRéponseSoumise({
        idCorrélation: 'id-correlation',
        idQuestion: 'q1',
        réponseCorrecte: false,
      })
    );

    expect(evenementRecu).toEqual({
      type: 'QUESTIONNAIRE_VRAI_FAUX_REPONSE_SOUMISE',
      donnees: {
        idCorrélation: 'id-correlation',
        idQuestion: 'q1',
        réponseCorrecte: false,
      },
      date: Temporal.Instant.from('2025-03-10T00:00:00Z'),
    });
  });
});
