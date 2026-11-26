import { describe, expect, it } from 'vitest';
import { consigneQuestionnaireVraiFauxTermineDansJournal } from '@bus/consigneQuestionnaireVraiFauxTermineDansJournal.js';
import { QuestionnaireVraiFauxTerminé } from '@bus/evenements/questionnaireVraiFauxTermine.js';
import { AdaptateurHachage } from '@infra/adaptateurHachage.js';
import { AdaptateurJournal } from '@infra/adaptateurJournal.js';
import { fauxAdaptateurHachage } from '../api/fauxObjets.js';
import { fabriqueAdaptateurHorloge } from '../infra/adaptateurHorlogePourLesTests.js';

describe('L’abonnement qui consigne la fin d’un questionnaire vrai/faux dans le journal', () => {
  it('consigne un évènement QuestionnaireVraiFauxTerminé pour un utilisateur identifié', async () => {
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

    await consigneQuestionnaireVraiFauxTermineDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    })(
      new QuestionnaireVraiFauxTerminé({
        idCorrélation: 'id-correlation',
        email: 'u1@example.com',
        codeRegion: 'FR-IDF',
        codeSecteur: 'A',
        codeTrancheEffectif: '00',
      })
    );

    expect(evenementRecu).toEqual({
      type: 'QUESTIONNAIRE_VRAI_FAUX_TERMINE',
      donnees: {
        idCorrélation: 'id-correlation',
        idUtilisateur: 'u1@example.com-hacheHMAC',
        codeRegion: 'FR-IDF',
        codeSecteur: 'A',
        codeTrancheEffectif: '00',
      },
      date: Temporal.Instant.from('2025-03-10T00:00:00Z'),
    });
  });

  it('consigne un évènement QuestionnaireVraiFauxTerminé pour un utilisateur anonyme', async () => {
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

    await consigneQuestionnaireVraiFauxTermineDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    })(
      new QuestionnaireVraiFauxTerminé({
        idCorrélation: 'id-correlation',
      })
    );

    expect(evenementRecu).toEqual({
      type: 'QUESTIONNAIRE_VRAI_FAUX_TERMINE',
      donnees: {
        idCorrélation: 'id-correlation',
      },
      date: Temporal.Instant.from('2025-03-10T00:00:00Z'),
    });
  });
});
