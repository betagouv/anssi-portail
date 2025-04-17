import { AdaptateurHorloge } from '../infra/adaptateurHorloge';
import { AdaptateurJournal } from '../infra/adaptateurJournal';
import { ProprieteTestRevendiquee } from './evenements/proprieteTestRevendiquee';

export const consigneEvenementProprieteTestRevendiqueeDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
}) => {
  return async function (evenement: ProprieteTestRevendiquee) {
    await adaptateurJournal.consigneEvenement({
      donnees: evenement,
      type: 'PROPRIETE_TEST_REVENDIQUEE',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
