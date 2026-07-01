import { AdaptateurHachage } from '../infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { AvisUtilisateurDonne } from './evenements/avisUtilisateurDonne.js';

export const consigneEvenementAvisUtilisateurDonneDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
  adaptateurHachage,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
  adaptateurHachage: AdaptateurHachage;
}) => {
  return async (evenement: AvisUtilisateurDonne) => {
    const idUtilisateur = evenement.emailDeContact ? adaptateurHachage.hache(evenement.emailDeContact) : undefined;
    await adaptateurJournal.consigneEvenement({
      donnees: {
        idUtilisateur,
        niveauDeSatisfaction: evenement.niveauDeSatisfaction,
      },
      type: 'AVIS_UTILISATEUR_DONNE',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
