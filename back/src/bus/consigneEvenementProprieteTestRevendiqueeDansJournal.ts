import { AdaptateurHorloge } from '../infra/adaptateurHorloge';
import { AdaptateurJournal } from '../infra/adaptateurJournal';
import { ProprieteTestRevendiquee } from './evenements/proprieteTestRevendiquee';
import { AdaptateurChiffrement } from '../infra/adaptateurChiffrement';

export const consigneEvenementProprieteTestRevendiqueeDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
  adaptateurChiffrement,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
  adaptateurChiffrement: AdaptateurChiffrement;
}) => {
  return async function (evenement: ProprieteTestRevendiquee) {
    await adaptateurJournal.consigneEvenement({
      donnees: {
        idUtilisateur: adaptateurChiffrement.hacheSha256(
          evenement.emailUtilisateur
        ),
        idResultatTest: evenement.idResultatTest,
      },
      type: 'PROPRIETE_TEST_REVENDIQUEE',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
