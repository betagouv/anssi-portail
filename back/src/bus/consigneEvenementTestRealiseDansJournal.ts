import { TestRealise } from './evenements/testRealise.js';
import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';

export const consigneEvenementTestRealiseDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
}) => {
  return async function (evenement: TestRealise) {
    await adaptateurJournal.consigneEvenement({
      donnees: evenement,
      type: 'TEST_REALISE',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
