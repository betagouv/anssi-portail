import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { SimulationNis2Terminee } from './evenements/simulationNis2Terminee.js';

export const consigneEvenementSimulationNis2TermineeDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
}) => {
  return async function (evenement: SimulationNis2Terminee) {
    await adaptateurJournal.consigneEvenement({
      donnees: evenement.reponses,
      type: 'SIMULATION_NIS2_TERMINEE',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
