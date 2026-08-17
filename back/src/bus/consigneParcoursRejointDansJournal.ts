import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { ParcoursRejoint } from './evenements/parcoursRejoint.js';

export const consigneParcoursRejointDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
}) => {
  return async function (evenement: ParcoursRejoint) {
    await adaptateurJournal.consigneEvenement({
      donnees: {
        idUtilisateur: evenement.emailHache,
        parcours: evenement.parcours,
        motif: evenement.motif,
        suivi: evenement.suivi,
      },
      type: 'PARCOURS_REJOINT',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
