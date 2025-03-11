import { TestRealise } from './testRealise';
import { AdaptateurHorloge } from '../infra/adaptateurHorloge';
import { AdaptateurJournal } from '../infra/adaptateurJournal';

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
