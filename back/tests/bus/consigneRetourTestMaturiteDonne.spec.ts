import assert from 'node:assert';
import { describe, it } from 'node:test';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';
import { consigneRetourTestMaturitéDonné } from '../../src/bus/consigeRetourTestMaturiteDonne.js';
import { RetourTestMaturitéDonné } from '../../src/bus/evenements/retourTestMaturiteDonne.js';

describe("L'abonnement qui consigne l'évènement de retour de test de maturité", () => {
  it("consigne l'évènement RetourTestDeMaturiteDonne", async () => {
    let évènementReçu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        évènementReçu = donneesEvenement;
      },
    };
    const adaptateurHorloge: AdaptateurHorloge = {
      maintenant: () => new Date('2025-03-10'),
    };

    await consigneRetourTestMaturitéDonné({
      adaptateurHorloge,
      adaptateurJournal,
    })(new RetourTestMaturitéDonné({ commentaire: 'un commentaire', retour: 'NEGATIF' }));

    assert.deepEqual(évènementReçu, {
      type: 'RETOUR_TEST_MATURITE_DONNE',
      donnees: { retour: 'NEGATIF', commentaire: 'un commentaire' },
      date: new Date('2025-03-10'),
    });
  });
});
