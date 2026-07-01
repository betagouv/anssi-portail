import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { ProprieteTestRevendiquee } from './evenements/proprieteTestRevendiquee.js';
import { AdaptateurHachage } from '../infra/adaptateurHachage.js';

export const consigneEvenementProprieteTestRevendiqueeDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
  adaptateurHachage,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
  adaptateurHachage: AdaptateurHachage;
}) => {
  return async function (evenement: ProprieteTestRevendiquee) {
    await adaptateurJournal.consigneEvenement({
      donnees: {
        idUtilisateur: adaptateurHachage.hache(evenement.utilisateur.email),
        idResultatTest: evenement.idResultatTest,
      },
      type: 'PROPRIETE_TEST_REVENDIQUEE',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
