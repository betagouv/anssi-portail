import { AdaptateurHorloge } from '../infra/adaptateurHorloge';
import { AdaptateurJournal } from '../infra/adaptateurJournal';
import { AdaptateurChiffrement } from '../infra/adaptateurChiffrement';
import { MiseAJourFavorisUtilisateur } from './miseAJourFavorisUtilisateur';
import { EntrepotFavori } from '../metier/entrepotFavori';

export const consigneEvenementMAJFavorisUtilisateurDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
  adaptateurChiffrement,
  entrepotFavori,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
  adaptateurChiffrement: AdaptateurChiffrement;
  entrepotFavori: EntrepotFavori;
}) => {
  return async function (evenement: MiseAJourFavorisUtilisateur) {
    const listeIdFavoris = (
      await entrepotFavori.tousCeuxDeUtilisateur(evenement?.email)
    ).map(({ idItemCyber }) => idItemCyber);
    await adaptateurJournal.consigneEvenement({
      donnees: {
        idUtilisateur: adaptateurChiffrement.hacheSha256(evenement.email),
        listeIdFavoris,
      },
      type: 'MISE_A_JOUR_FAVORIS_UTILISATEUR',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
