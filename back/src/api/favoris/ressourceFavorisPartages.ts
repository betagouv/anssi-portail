import { ConfigurationServeur } from '../configurationServeur';
import { Request, Response, Router } from 'express';
import { check } from 'express-validator';

const ressourceFavorisPartages = ({
  middleware,
  entrepotFavori,
  entrepotUtilisateur,
}: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get(
    '/:id',
    [check('id').isUUID().withMessage("L'id est invalide")],
    middleware.valide(),
    async (requete: Request, reponse: Response) => {
      const utilisateurPartageur = await entrepotUtilisateur.parIdListeFavoris(
        requete.params.id
      );

      if (!utilisateurPartageur) {
        reponse.sendStatus(404);
        return;
      }

      const favoris = await entrepotFavori.tousCeuxDeUtilisateur(
        utilisateurPartageur.email
      );
      const favorisPartages = favoris.map((favori) => favori.idItemCyber);

      reponse.send({
        prenom: utilisateurPartageur.prenom,
        favorisPartages: favorisPartages,
      });
    }
  );
  return routeur;
};

export { ressourceFavorisPartages };
