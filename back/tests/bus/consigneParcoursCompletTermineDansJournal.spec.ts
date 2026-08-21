import assert from 'node:assert';
import { describe, it } from 'node:test';
import { ParcoursCompletTerminé } from '../../src/bus/evenements/parcoursCompletTermine.js';
import { AdaptateurHachage } from '../../src/infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';
import { fauxAdaptateurHachage } from '../api/fauxObjets.js';
import { consigneParcoursCompletTerminéDansJournal } from '../../src/bus/consigneParcoursCompletTermineDansJournal.js';

describe("L'abonnement qui consigne l'événement de complétion du parcours complet", () => {
  it("consigne l'événement ParcoursCompletTerminé", async () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge: AdaptateurHorloge = {
      maintenant: () => new Date('2025-03-10'),
    };

    const adaptateurHachage: AdaptateurHachage = {
      ...fauxAdaptateurHachage,
      hache: (valeur) => `${valeur}-hacheHMAC`,
    };

    await consigneParcoursCompletTerminéDansJournal({
      adaptateurHorloge,
      adaptateurJournal,
      adaptateurHachage,
    })(new ParcoursCompletTerminé('test@email'));

    assert.deepEqual(evenementRecu, {
      type: 'PARCOURS_COMPLET_TERMINÉ',
      donnees: { idUtilisateur: 'test@email-hacheHMAC' },
      date: new Date('2025-03-10'),
    });
  });
});
