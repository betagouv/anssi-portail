import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { RetourArticleDonné } from './evenements/retourArticleDonne.js';

export const consigneRetourArticleDonnéDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
}) => {
  return async function (évènement: RetourArticleDonné) {
    await adaptateurJournal.consigneEvenement({
      donnees: évènement,
      type: 'RETOUR_ARTICLE_DONNE',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
