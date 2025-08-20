import { MiseAJourFavorisUtilisateur } from '../../bus/miseAJourFavorisUtilisateur';
import { ConfigurationServeur } from '../configurationServeur';
import { Router } from 'express';

const ressourceFavori = ({
  middleware,
  entrepotFavori,
  busEvenements,
  entrepotUtilisateur,
  adaptateurHachage,
}: ConfigurationServeur) => {
  const routeur = Router();

  routeur.delete(
    '/:id',
    middleware.verifieJWT,
    middleware.ajouteUtilisateurARequete(
      entrepotUtilisateur,
      adaptateurHachage
    ),
    middleware.aseptise('id'),
    async (requete, reponse) => {
      let id = requete.params.id;
      id = id.replaceAll('&#x2F;', '/');
      const utilisateur = requete.utilisateur;
      await entrepotFavori.retire({ idItemCyber: id, utilisateur });

      await busEvenements.publie(
        new MiseAJourFavorisUtilisateur({ utilisateur })
      );
      reponse.sendStatus(200);
    }
  );

  return routeur;
};

export { ressourceFavori };
