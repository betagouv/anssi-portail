import { AdaptateurHachage } from '../infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { ParcoursAllégéTerminé } from './evenements/parcoursAllegeTermine.js';

export const consigneParcoursAllégéTerminéDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
  adaptateurHachage,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
  adaptateurHachage: AdaptateurHachage;
}) => {
  return async function (evenement: ParcoursAllégéTerminé) {
    await adaptateurJournal.consigneEvenement({
      donnees: {
        idUtilisateur: adaptateurHachage.hache(evenement.email),
      },
      type: 'PARCOURS_ALLÉGÉ_TERMINÉ',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
