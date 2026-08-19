import { AdaptateurHachage } from '../infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { ParcoursChangé } from './evenements/parcoursChange.js';

export const consigneParcoursChangéDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
  adaptateurHachage,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
  adaptateurHachage: AdaptateurHachage;
}) => {
  return async function (evenement: ParcoursChangé) {
    await adaptateurJournal.consigneEvenement({
      donnees: {
        idUtilisateur: adaptateurHachage.hache(evenement.email),
        parcoursPrécédent: evenement.parcoursPrécédent,
        parcours: evenement.parcours,
        motif: evenement.motif,
        suivi: evenement.suivi,
      },
      type: 'PARCOURS_CHANGÉ',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
