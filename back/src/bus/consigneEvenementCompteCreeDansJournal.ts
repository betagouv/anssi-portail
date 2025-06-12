import { AdaptateurHorloge } from '../infra/adaptateurHorloge';
import { AdaptateurJournal } from '../infra/adaptateurJournal';
import { CompteCree } from './evenements/compteCree';
import { AdaptateurHachage } from '../infra/adaptateurHachage';

export const consigneEvenementCompteCreeDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
  adaptateurHachage,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
  adaptateurHachage: AdaptateurHachage;
}) => {
  return async function (evenement: CompteCree) {
    await adaptateurJournal.consigneEvenement({
      donnees: {
        idUtilisateur: adaptateurHachage.hache(evenement.email),
      },
      type: 'NOUVEL_UTILISATEUR_INSCRIT',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
