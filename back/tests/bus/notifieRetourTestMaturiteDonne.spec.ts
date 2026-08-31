import assert from 'assert';
import { suite as describe, it } from 'node:test';
import { fausseMessagerieInstantanee } from '../api/fauxObjets.js';
import { notifieUnRetourNégatifSurTestMaturité } from '../../src/bus/notifieRetourNegatifSurTestMaturite.js';
import { RetourTestMaturitéDonné } from '../../src/bus/evenements/retourTestMaturiteDonne.js';

describe("L'abonnement qui notifie un retour de test de maturité négatif", () => {
  it('consigne un évènement AvisMesureDonne', async () => {
    let évènementReçu;
    const messagerieInstantanee = {
      ...fausseMessagerieInstantanee,
      notifieUnRetourNégatifSurTestMaturité: async (donneesEvenement: unknown) => {
        évènementReçu = donneesEvenement;
      },
    };
    await notifieUnRetourNégatifSurTestMaturité({ messagerieInstantanee })(
      new RetourTestMaturitéDonné({
        commentaire: "J'aime pas",
        retour: 'NEGATIF',
      })
    );

    assert.deepEqual(évènementReçu, {
      commentaire: "J'aime pas",
    });
  });
});
