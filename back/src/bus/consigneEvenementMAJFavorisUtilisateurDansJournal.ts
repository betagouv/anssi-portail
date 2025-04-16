import { AdaptateurHorloge } from '../infra/adaptateurHorloge';
import { AdaptateurJournal } from '../infra/adaptateurJournal';
import { AdaptateurChiffrement } from '../infra/adaptateurChiffrement';
import { MiseAJourFavorisUtilisateur } from './miseAJourFavorisUtilisateur';

export const consigneEvenementMAJFavorisUtilisateurDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
  adaptateurChiffrement,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
  adaptateurChiffrement: AdaptateurChiffrement;
}) => {
  return async function (evenement: MiseAJourFavorisUtilisateur) {
    await adaptateurJournal.consigneEvenement({
      donnees: {
        idUtilisateur: adaptateurChiffrement.hacheSha256(evenement.email),
        listeIdFavoris: evenement.listeIdFavoris,
      },
      type: 'MISE_A_JOUR_FAVORIS_UTILISATEUR',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
