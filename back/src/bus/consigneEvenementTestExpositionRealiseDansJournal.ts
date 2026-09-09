import { TestExpositionRéalisé } from './evenements/TestExpositionRealise.js';
import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';

export const consigneEvenementTestExpositionRealiseDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
}) => {
  return async function (evenement: TestExpositionRéalisé) {
    await adaptateurJournal.consigneEvenement({
      donnees: evenement,
      type: 'TEST_EXPOSITION_REALISE',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
