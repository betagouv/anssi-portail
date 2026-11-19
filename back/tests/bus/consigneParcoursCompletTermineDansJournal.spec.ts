import { describe, expect, it } from 'vitest';
import { consigneParcoursCompletTerminéDansJournal } from '../../src/bus/consigneParcoursCompletTermineDansJournal.js';
import { ParcoursCompletTerminé } from '../../src/bus/evenements/parcoursCompletTermine.js';
import { AdaptateurHachage } from '../../src/infra/adaptateurHachage.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';
import { fauxAdaptateurHachage } from '../api/fauxObjets.js';
import { fabriqueAdaptateurHorloge } from '../infra/adaptateurHorlogePourLesTests.js';

describe("L'abonnement qui consigne l'événement de complétion du parcours complet", () => {
  it("consigne l'événement ParcoursCompletTerminé", async () => {
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

    await consigneParcoursCompletTerminéDansJournal({
      adaptateurHorloge,
      adaptateurJournal,
      adaptateurHachage,
    })(new ParcoursCompletTerminé('test@email'));

    expect(evenementRecu).toEqual({
      type: 'PARCOURS_COMPLET_TERMINÉ',
      donnees: { idUtilisateur: 'test@email-hacheHMAC' },
      date: Temporal.Instant.from('2025-03-10T00:00:00Z'),
    });
  });
});
