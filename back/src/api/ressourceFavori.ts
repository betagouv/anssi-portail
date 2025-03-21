import { ConfigurationServeur } from './configurationServeur';
import { Router } from 'express';

const ressourceFavori = ({
  middleware,
  entrepotFavori,
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
      reponse.send(200);
    }
  );

  return routeur;
};

export { ressourceFavori };
