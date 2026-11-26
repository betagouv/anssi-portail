import { describe, expect, it } from 'vitest';
import { consigneTestHameconnageReponseSoumiseDansJournal } from '@bus/consigneTestHameconnageReponseSoumiseDansJournal.js';
import { TestHameçonnageRéponseSoumise } from '@bus/evenements/testHameconnageReponseSoumise.js';
import { AdaptateurJournal } from '@infra/adaptateurJournal.js';
import { fauxAdaptateurHachage } from '../api/fauxObjets.js';
import { fabriqueAdaptateurHorloge } from '../infra/adaptateurHorlogePourLesTests.js';

describe("L'abonnement qui consigne une réponse au test d'hameçonnage dans le journal", () => {
  it('consigne un évènement TestHameçonnageRéponseSoumise pour un utilisateur identifié', async () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge = fabriqueAdaptateurHorloge('2025-03-10T00:00:00Z');

    await consigneTestHameconnageReponseSoumiseDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage: fauxAdaptateurHachage,
    })(
      new TestHameçonnageRéponseSoumise({
        idCorrélation: 'id-correlation',
        idMail: 'ENEDIS',
        réponseCorrecte: true,
        email: 'u1@example.com',
        codeRegion: 'FR-IDF',
        codeSecteur: 'A',
        codeTrancheEffectif: '00',
        parcours: 'allégé',
      })
    );

    expect(evenementRecu).toEqual({
      type: 'TEST_HAMECONNAGE_REPONSE_SOUMISE',
      donnees: {
        idCorrélation: 'id-correlation',
        idMail: 'ENEDIS',
        réponseCorrecte: true,
        idUtilisateur: 'u1@example.com-hache',
        codeRegion: 'FR-IDF',
        codeSecteur: 'A',
        codeTrancheEffectif: '00',
        parcours: 'allégé',
      },
      date: Temporal.Instant.from('2025-03-10T00:00:00Z'),
    });
  });

  it('consigne un évènement TestHameçonnageRéponseSoumise pour un utilisateur anonyme', async () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge = fabriqueAdaptateurHorloge('2025-03-10T00:00:00Z');
    await consigneTestHameconnageReponseSoumiseDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage: fauxAdaptateurHachage,
    })(
      new TestHameçonnageRéponseSoumise({
        idCorrélation: 'id-correlation',
        idMail: 'ENEDIS',
        réponseCorrecte: false,
      })
    );

    expect(evenementRecu).toEqual({
      type: 'TEST_HAMECONNAGE_REPONSE_SOUMISE',
      donnees: {
        idCorrélation: 'id-correlation',
        idMail: 'ENEDIS',
        réponseCorrecte: false,
      },
      date: Temporal.Instant.from('2025-03-10T00:00:00Z'),
    });
  });
});
