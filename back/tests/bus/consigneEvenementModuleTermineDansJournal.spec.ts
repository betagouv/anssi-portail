import assert from 'node:assert';
import { describe, it } from 'node:test';
import { consigneEvenementModuleTerminéDansJournal } from '../../src/bus/consigneEvenementModuleTerminéDansJournal';
import { ModuleTermine } from '../../src/bus/evenements/moduleTermine';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal';

describe("L'abonnement qui consigne la complétion d'un module par un utilisateur dans le journal", () => {
  it('consigne un évènement ModuleTermine', async () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge: AdaptateurHorloge = {
      maintenant: () => new Date('2025-03-10'),
    };

    await consigneEvenementModuleTerminéDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
    })(new ModuleTermine('u1@example.com-hache', 1, 'Cyberdépart'));

    assert.deepEqual(evenementRecu, {
      type: 'MODULE_TERMINE',
      donnees: {
        idUtilisateur: 'u1@example.com-hache',
        idModule: 1,
        nomModule: 'Cyberdépart',
      },
      date: new Date('2025-03-10'),
    });
  });
});
