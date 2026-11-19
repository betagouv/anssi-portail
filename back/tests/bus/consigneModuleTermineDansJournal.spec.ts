import { describe, expect, it } from 'vitest';
import { consigneModuleTerminéDansJournal } from '../../src/bus/consigneModuleTerminéDansJournal.js';
import { ModuleTermine } from '../../src/bus/evenements/moduleTermine.js';
import { AdaptateurHachage } from '../../src/infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';
import { fauxAdaptateurHachage } from '../api/fauxObjets.js';

describe("L'abonnement qui consigne la complétion d'un module par un utilisateur dans le journal", () => {
  it('consigne un évènement ModuleTermine', async () => {
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

    await consigneModuleTerminéDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    })(new ModuleTermine('u1@example.com', 1, 'Cyberdépart', 'allégé'));

    expect(evenementRecu).toEqual({
      type: 'MODULE_TERMINE',
      donnees: {
        idUtilisateur: 'u1@example.com-hacheHMAC',
        idModule: 1,
        nomModule: 'Cyberdépart',
        parcours: 'allégé',
      },
      date: Temporal.Instant.from('2025-03-10T00:00:00Z'),
    });
  });
});
