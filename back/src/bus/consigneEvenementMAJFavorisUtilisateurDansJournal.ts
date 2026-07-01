import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { MiseAJourFavorisUtilisateur } from './miseAJourFavorisUtilisateur.js';
import { EntrepotFavori } from '../metier/entrepotFavori.js';
import { AdaptateurHachage } from '../infra/adaptateurHachage.js';

export const consigneEvenementMAJFavorisUtilisateurDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
  adaptateurHachage,
  entrepotFavori,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
  adaptateurHachage: AdaptateurHachage;
  entrepotFavori: EntrepotFavori;
}) => {
  return async function (evenement: MiseAJourFavorisUtilisateur) {
    const listeIdFavoris = (await entrepotFavori.tousCeuxDeUtilisateur(evenement?.utilisateur)).map(
      ({ idItemCyber }) => idItemCyber
    );
    await adaptateurJournal.consigneEvenement({
      donnees: {
        idUtilisateur: adaptateurHachage.hache(evenement.utilisateur.email),
        listeIdFavoris,
      },
      type: 'MISE_A_JOUR_FAVORIS_UTILISATEUR',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
