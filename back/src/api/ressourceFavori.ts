import { MiseAJourFavorisUtilisateur } from '../bus/miseAJourFavorisUtilisateur';
import { ConfigurationServeur } from './configurationServeur';
import { Router } from 'express';

const ressourceFavori = ({
  middleware,
  entrepotFavori,
  busEvenements,
}: ConfigurationServeur) => {
  const routeur = Router();

  routeur.delete(
    '/:id',
    middleware.verifieJWT,
    middleware.aseptise('id'),
    async (requete, reponse) => {
      let id = requete.params.id;
      id = id.replaceAll('&#x2F;', '/');
      await entrepotFavori.retire({
        idItemCyber: id,
        emailUtilisateur: requete.session!.email,
      });

      await busEvenements.publie(
        new MiseAJourFavorisUtilisateur({
          email: requete.session?.email,
        })
      );
      reponse.send(200);
    }
  );

  return routeur;
};

export { ressourceFavori };
