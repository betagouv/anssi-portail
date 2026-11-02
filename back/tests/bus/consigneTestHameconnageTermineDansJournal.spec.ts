import { describe, expect, it } from 'vitest';
import { consigneTestHameconnageTermineDansJournal } from '../../src/bus/consigneTestHameconnageTermineDansJournal.js';
import { TestHameçonnageTerminé } from '../../src/bus/evenements/testHameconnageTermine.js';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';
import { fauxAdaptateurHachage } from '../api/fauxObjets.js';

describe("L'abonnement qui consigne la fin du test d'hameçonnage dans le journal", () => {
  it('consigne un évènement TestHameçonnageTerminé pour un utilisateur identifié', async () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge: AdaptateurHorloge = {
      maintenant: () => new Date('2025-03-10'),
    };

    await consigneTestHameconnageTermineDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage: fauxAdaptateurHachage,
    })(
      new TestHameçonnageTerminé({
        idCorrélation: 'id-correlation',
        email: 'u1@example.com',
        codeRegion: 'FR-IDF',
        codeSecteur: 'A',
        codeTrancheEffectif: '00',
        parcours: 'allégé',
      })
    );

    expect(evenementRecu).toEqual({
      type: 'TEST_HAMECONNAGE_TERMINE',
      donnees: {
        idCorrélation: 'id-correlation',
        idUtilisateur: 'u1@example.com-hache',
        codeRegion: 'FR-IDF',
        codeSecteur: 'A',
        codeTrancheEffectif: '00',
        parcours: 'allégé',
      },
      date: new Date('2025-03-10'),
    });
  });

  it('consigne un évènement TestHameçonnageTerminé pour un utilisateur anonyme', async () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge: AdaptateurHorloge = {
      maintenant: () => new Date('2025-03-10'),
    };

    await consigneTestHameconnageTermineDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage: fauxAdaptateurHachage,
    })(
      new TestHameçonnageTerminé({
        idCorrélation: 'id-correlation',
      })
    );

    expect(evenementRecu).toEqual({
      type: 'TEST_HAMECONNAGE_TERMINE',
      donnees: {
        idCorrélation: 'id-correlation',
      },
      date: new Date('2025-03-10'),
    });
  });
});
