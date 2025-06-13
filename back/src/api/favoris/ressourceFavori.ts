import { MiseAJourFavorisUtilisateur } from '../../bus/miseAJourFavorisUtilisateur';
import { ConfigurationServeur } from '../configurationServeur';
import { Router } from 'express';

const ressourceFavori = ({
  middleware,
  entrepotFavori,
  entrepotUtilisateur,
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
      const utilisateur = (await entrepotUtilisateur.parEmail(
        requete.session!.email
      ))!;
      await entrepotFavori.retire({ idItemCyber: id, utilisateur });

      await busEvenements.publie(
        new MiseAJourFavorisUtilisateur({ utilisateur })
      );
      reponse.send(200);
    }
  );

  return routeur;
};

export { ressourceFavori };
