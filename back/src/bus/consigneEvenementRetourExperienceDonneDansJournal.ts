import { AdaptateurJournal } from '../infra/adaptateurJournal';
import { AdaptateurHorloge } from '../infra/adaptateurHorloge';
import { AdaptateurHachage } from '../infra/adaptateurHachage';
import { RetourExperienceDonne } from './evenements/retourExperienceDonne';

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
    const idUtilisateur = evenement.emailDeContact
      ? adaptateurHachage.hache(evenement.emailDeContact)
      : undefined;
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
