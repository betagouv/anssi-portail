import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { CompteCree } from './evenements/compteCree.js';
import { AdaptateurHachage } from '../infra/adaptateurHachage.js';

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
