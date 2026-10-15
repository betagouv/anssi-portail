import { AdaptateurHachage } from '../infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { OutilTéléchargé } from './evenements/outilTelecharge.js';

export const consigneOutilTéléchargéDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
  adaptateurHachage,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
  adaptateurHachage: AdaptateurHachage;
}) => {
  return async (evenement: OutilTéléchargé) => {
    await adaptateurJournal.consigneEvenement({
      donnees: {
        idUtilisateur: adaptateurHachage.hache(evenement.email),
        outil: evenement.outil,
      },
      type: 'OUTIL_TÉLÉCHARGÉ',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
