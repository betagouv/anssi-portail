import { AdaptateurHachage } from '../infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { ParcoursRejoint } from './evenements/parcoursRejoint.js';

export const consigneParcoursRejointDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
  adaptateurHachage,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
  adaptateurHachage: AdaptateurHachage;
}) => {
  return async function (evenement: ParcoursRejoint) {
    await adaptateurJournal.consigneEvenement({
      donnees: {
        idUtilisateur: adaptateurHachage.hache(evenement.email),
        parcours: evenement.parcours,
        motif: evenement.motif,
        suivi: evenement.suivi,
      },
      type: 'PARCOURS_REJOINT',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
