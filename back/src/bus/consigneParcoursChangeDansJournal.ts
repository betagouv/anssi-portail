import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { ParcoursChangé } from './evenements/parcoursChange.js';

export const consigneParcoursChangéDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
}) => {
  return async function (evenement: ParcoursChangé) {
    await adaptateurJournal.consigneEvenement({
      donnees: {
        idUtilisateur: evenement.emailHache,
        parcoursPrécédent: evenement.parcoursPrécédent,
        parcours: evenement.parcours,
        motif: evenement.motif,
      },
      type: 'PARCOURS_CHANGÉ',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
