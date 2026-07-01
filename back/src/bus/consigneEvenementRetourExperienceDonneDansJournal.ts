import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurHachage } from '../infra/adaptateurHachage.js';
import { RetourExperienceDonne } from './evenements/retourExperienceDonne.js';

export const consigneEvenementRetourExperienceDonneDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
  adaptateurHachage,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
  adaptateurHachage: AdaptateurHachage;
}) => {
  return async (evenement: RetourExperienceDonne) => {
    const idUtilisateur = evenement.emailDeContact ? adaptateurHachage.hache(evenement.emailDeContact) : undefined;
    await adaptateurJournal.consigneEvenement({
      donnees: {
        idUtilisateur,
        raison: evenement.raison,
      },
      type: 'RETOUR_EXPERIENCE_DONNE',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
