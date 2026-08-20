import { AdaptateurHachage } from '../infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { ParcoursCompletTerminé } from './evenements/parcoursCompletTermine.js';

export const consigneParcoursCompletTerminéDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
  adaptateurHachage,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
  adaptateurHachage: AdaptateurHachage;
}) => {
  return async function (evenement: ParcoursCompletTerminé) {
    await adaptateurJournal.consigneEvenement({
      donnees: {
        idUtilisateur: adaptateurHachage.hache(evenement.email),
      },
      type: 'PARCOURS_COMPLET_TERMINÉ',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
