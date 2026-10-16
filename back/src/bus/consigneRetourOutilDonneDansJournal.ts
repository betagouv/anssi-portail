import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { RetourOutilDonné } from './evenements/retourOutilDonne.js';

export const consigneRetourOutilDonnéDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
}) => {
  return async function (évènement: RetourOutilDonné) {
    await adaptateurJournal.consigneEvenement({
      donnees: évènement,
      type: 'RETOUR_OUTIL_DONNE',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
