import assert from 'node:assert';
import { describe, it } from 'node:test';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';
import { consigneRetourMiniTestDonné } from '../../src/bus/consigeRetourMiniTestDonne.js';
import { RetourMiniTestDonné } from '../../src/bus/evenements/retourMiniTestDonne.js';
import { MiniTest } from '../../src/metier/mini-tests/mini-test.js';

describe("L'abonnement qui consigne l'évènement de retour de test de maturité", () => {
  [
    { miniTest: 'test-maturité' as MiniTest, expected: { type: 'RETOUR_TEST_MATURITE_DONNE' } },
    { miniTest: 'vrai-faux' as MiniTest, expected: { type: 'RETOUR_TEST_VRAI_FAUX_DONNÉ' } },
  ].forEach(({ miniTest, expected }: { miniTest: MiniTest; expected: { type: string } }) => {
    it(`consigne l'évènement ${miniTest}`, async () => {
      let évènementReçu;
      const adaptateurJournal: AdaptateurJournal = {
        consigneEvenement: async (donneesEvenement: unknown) => {
          évènementReçu = donneesEvenement;
        },
      };
      const adaptateurHorloge: AdaptateurHorloge = {
        maintenant: () => new Date('2025-03-10'),
      };

      await consigneRetourMiniTestDonné({
        adaptateurHorloge,
        adaptateurJournal,
      })(new RetourMiniTestDonné({ miniTest, commentaire: 'un commentaire', retour: 'NEGATIF' }));

      assert.deepEqual(évènementReçu, {
        type: expected.type,
        donnees: { retour: 'NEGATIF', commentaire: 'un commentaire' },
        date: new Date('2025-03-10'),
      });
    });
  });
});
