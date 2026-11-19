import { describe, expect, it } from 'vitest';
import { consigneRetourMiniTestDonnéDansJournal } from '../../src/bus/consigneRetourMiniTestDonneDansJournal.js';
import { RetourMiniTestDonné } from '../../src/bus/evenements/retourMiniTestDonne.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';
import { MiniTest } from '../../src/metier/mini-tests/mini-test.js';
import { fabriqueAdaptateurHorloge } from '../infra/adaptateurHorlogePourLesTests.js';

describe("L'abonnement qui consigne l'évènement de retour de test de maturité", () => {
  it.each([
    { miniTest: 'test-maturité' as MiniTest, expected: { type: 'RETOUR_TEST_MATURITE_DONNE' } },
    { miniTest: 'vrai-faux' as MiniTest, expected: { type: 'RETOUR_TEST_VRAI_FAUX_DONNÉ' } },
    { miniTest: 'hameconnage' as MiniTest, expected: { type: 'RETOUR_TEST_HAMECONNAGE_DONNÉ' } },
  ])(`consigne l'évènement $miniTest`, async ({ miniTest, expected }) => {
    let évènementReçu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        évènementReçu = donneesEvenement;
      },
    };
    const adaptateurHorloge = fabriqueAdaptateurHorloge('2025-03-10T00:00:00Z');

    await consigneRetourMiniTestDonnéDansJournal({
      adaptateurHorloge,
      adaptateurJournal,
    })(new RetourMiniTestDonné({ miniTest, commentaire: 'un commentaire', retour: 'NEGATIF' }));

    expect(évènementReçu).toEqual({
      type: expected.type,
      donnees: { retour: 'NEGATIF', commentaire: 'un commentaire' },
      date: Temporal.Instant.from('2025-03-10T00:00:00Z'),
    });
  });
});
