import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { UtilisateurConnecte } from './evenements/utilisateurConnecte.js';

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
