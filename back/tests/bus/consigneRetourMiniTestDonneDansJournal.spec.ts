import { describe, expect, it } from 'vitest';
import { consigneRetourMiniTestDonnéDansJournal } from '../../src/bus/consigneRetourMiniTestDonneDansJournal.js';
import { RetourMiniTestDonné } from '../../src/bus/evenements/retourMiniTestDonne.js';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';
import { MiniTest } from '../../src/metier/mini-tests/mini-test.js';

describe("L'abonnement qui consigne l'évènement de retour de test de maturité", () => {
  it.each([
    { miniTest: 'test-maturité' as MiniTest, expected: { type: 'RETOUR_TEST_MATURITE_DONNE' } },
    { miniTest: 'vrai-faux' as MiniTest, expected: { type: 'RETOUR_TEST_VRAI_FAUX_DONNÉ' } },
  ])(`consigne l'évènement $miniTest`, async ({ miniTest, expected }) => {
    let évènementReçu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        évènementReçu = donneesEvenement;
      },
    };
    const adaptateurHorloge: AdaptateurHorloge = {
      maintenant: () => new Date('2025-03-10'),
    };

    await consigneRetourMiniTestDonnéDansJournal({
      adaptateurHorloge,
      adaptateurJournal,
    })(new RetourMiniTestDonné({ miniTest, commentaire: 'un commentaire', retour: 'NEGATIF' }));

    expect(évènementReçu).toEqual({
      type: expected.type,
      donnees: { retour: 'NEGATIF', commentaire: 'un commentaire' },
      date: new Date('2025-03-10'),
    });
  });
});
