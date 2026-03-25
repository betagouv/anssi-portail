import { AdaptateurHorloge } from '../infra/adaptateurHorloge';
import { AdaptateurJournal } from '../infra/adaptateurJournal';
import { SimulationNis2Terminee } from './evenements/simulationNis2Terminee';

export const consigneEvenementSimulationNis2TermineeDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
}) => {
  return async function (evenement: SimulationNis2Terminee) {
    await adaptateurJournal.consigneEvenement({
      donnees: {
        question1EstTrue: evenement.question1,
      },
      type: 'SIMULATION_NIS2_TERMINEE',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
