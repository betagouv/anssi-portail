import { describe, expect, it } from 'vitest';
import { consigneParcoursAllégéTerminéDansJournal } from '../../src/bus/consigneParcoursAllegeTermineDansJournal.js';
import { ParcoursAllégéTerminé } from '../../src/bus/evenements/parcoursAllegeTermine.js';
import { AdaptateurHachage } from '../../src/infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';
import { fauxAdaptateurHachage } from '../api/fauxObjets.js';

describe("L'abonnement qui consigne l'événement de complétion du parcours allégé", () => {
  it("consigne l'événement ParcoursAllégéTerminé", async () => {
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

    await consigneParcoursAllégéTerminéDansJournal({
      adaptateurHorloge,
      adaptateurJournal,
      adaptateurHachage,
    })(new ParcoursAllégéTerminé('test@email'));

    expect(evenementRecu).toEqual({
      type: 'PARCOURS_ALLÉGÉ_TERMINÉ',
      donnees: { idUtilisateur: 'test@email-hacheHMAC' },
      date: Temporal.Instant.from('2025-03-10T00:00:00Z'),
    });
  });
});
