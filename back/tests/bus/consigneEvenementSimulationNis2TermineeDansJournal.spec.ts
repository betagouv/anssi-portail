import assert from 'node:assert';
import { describe, it } from 'node:test';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal';
import { SimulationNis2Terminee } from '../../src/bus/evenements/simulationNis2Terminee';
import { consigneEvenementSimulationNis2TermineeDansJournal } from '../../src/bus/consigneEvenementSimulationNis2TermineeDansJournal';

describe("L'abonnement qui consigne une simulation NIS2 terminée dans le journal", () => {
  it('consigne un évènement SimulationNis2Terminee', async () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge: AdaptateurHorloge = {
      maintenant: () => new Date('2026-03-24'),
    };

    await consigneEvenementSimulationNis2TermineeDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
    })(new SimulationNis2Terminee({ question1: false }));

    assert.deepEqual(evenementRecu, {
      type: 'SIMULATION_NIS2_TERMINEE',
      donnees: { question1EstTrue: false },
      date: new Date('2026-03-24'),
    });
  });
});
