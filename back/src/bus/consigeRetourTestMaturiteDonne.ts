import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { RetourTestMaturitéDonné } from './evenements/retourTestMaturiteDonne.js';

export const consigneRetourTestMaturitéDonné = ({
  adaptateurJournal,
  adaptateurHorloge,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
}) => {
  return async (évènement: RetourTestMaturitéDonné) => {
    await adaptateurJournal.consigneEvenement({
      donnees: {
        commentaire: évènement.commentaire,
        retour: évènement.retour,
      },
      type: 'RETOUR_TEST_MATURITE_DONNE',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
