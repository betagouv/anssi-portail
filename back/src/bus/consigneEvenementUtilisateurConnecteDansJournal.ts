import { AdaptateurHorloge } from '../infra/adaptateurHorloge';
import { AdaptateurJournal } from '../infra/adaptateurJournal';
import { UtilisateurConnecte } from './evenements/utilisateurConnecte';

export const consigneEvenementUtilisateurConnecteDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
}) => {
  return async function (evenement: UtilisateurConnecte) {
    await adaptateurJournal.consigneEvenement({
      donnees: {
        idUtilisateur: evenement.emailHache,
        connexionAvecMFA: evenement.connexionAvecMFA,
      },
      type: 'UTILISATEUR_CONNECTE',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
