import { AdaptateurHorloge } from '../infra/adaptateurHorloge';
import { AdaptateurJournal } from '../infra/adaptateurJournal';
import { MiseAJourFavorisUtilisateur } from './miseAJourFavorisUtilisateur';
import { EntrepotFavori } from '../metier/entrepotFavori';
import { AdaptateurHachage } from '../infra/adaptateurHachage';

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
    const listeIdFavoris = (
      await entrepotFavori.tousCeuxDeUtilisateur(evenement?.email)
    ).map(({ idItemCyber }) => idItemCyber);
    await adaptateurJournal.consigneEvenement({
      donnees: {
        idUtilisateur: adaptateurHachage.hache(evenement.email),
        listeIdFavoris,
      },
      type: 'MISE_A_JOUR_FAVORIS_UTILISATEUR',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
