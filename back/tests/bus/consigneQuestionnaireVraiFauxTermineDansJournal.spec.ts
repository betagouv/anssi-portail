import { describe, expect, it } from 'vitest';
import { consigneQuestionnaireVraiFauxTermineDansJournal } from '../../src/bus/consigneQuestionnaireVraiFauxTermineDansJournal.js';
import { QuestionnaireVraiFauxTerminé } from '../../src/bus/evenements/questionnaireVraiFauxTermine.js';
import { AdaptateurHachage } from '../../src/infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';
import { fauxAdaptateurHachage } from '../api/fauxObjets.js';

describe('L’abonnement qui consigne la fin d’un questionnaire vrai/faux dans le journal', () => {
  it('consigne un évènement QuestionnaireVraiFauxTerminé pour un utilisateur identifié', async () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge: AdaptateurHorloge = {
      maintenant: () => Temporal.Instant.from('2025-03-10T00:00:00Z'),
      maintenantZoné: () => Temporal.Instant.from('2025-03-10T00:00:00Z').toZonedDateTimeISO(Temporal.Now.timeZoneId()),
    };
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
    const adaptateurHorloge: AdaptateurHorloge = {
      maintenant: () => Temporal.Instant.from('2025-03-10T00:00:00Z'),
      maintenantZoné: () => Temporal.Instant.from('2025-03-10T00:00:00Z').toZonedDateTimeISO(Temporal.Now.timeZoneId()),
    };
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
