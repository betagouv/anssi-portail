import { AdaptateurHorloge } from '../infra/adaptateurHorloge';
import { AdaptateurJournal } from '../infra/adaptateurJournal';
import { ProprieteTestRevendiquee } from './evenements/proprieteTestRevendiquee';
import { AdaptateurHachage } from '../infra/adaptateurHachage';

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
