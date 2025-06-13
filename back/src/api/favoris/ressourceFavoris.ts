import { ConfigurationServeur } from '../configurationServeur';
import { Request, Response, Router } from 'express';
import { check } from 'express-validator';
import { MiseAJourFavorisUtilisateur } from '../../bus/miseAJourFavorisUtilisateur';

const ressourceFavoris = ({
  busEvenements,
  middleware,
  entrepotFavori,
  entrepotUtilisateur,
}: ConfigurationServeur) => {
  const routeur = Router();

  routeur.post(
    '/',
    middleware.verifieJWT,
    middleware.aseptise('idItemCyber'),
    [
      check('idItemCyber')
        .not()
        .isEmpty()
        .withMessage("L'idItemCyber est invalide"),
    ],
    middleware.valide(),
    async (requete: Request, reponse: Response) => {
      let idItemCyber = requete.body.idItemCyber;
      idItemCyber = idItemCyber.replaceAll('&#x2F;', '/');
      const utilisateur = (await entrepotUtilisateur.parEmail(
        requete.session?.email
      ))!;
      await entrepotFavori.ajoute({
        idItemCyber,
        utilisateur,
      });

      await busEvenements.publie(
        new MiseAJourFavorisUtilisateur({
          utilisateur,
        })
      );
      reponse.sendStatus(201);
    }
  );

  routeur.get(
    '/',
    middleware.verifieJWT,
    async (requete: Request, reponse: Response) => {
      const utilisateur = (await entrepotUtilisateur.parEmail(
        requete.session?.email
      ))!;
      const favoris = await entrepotFavori.tousCeuxDeUtilisateur(utilisateur);
      reponse.status(200).send(favoris.map((favori) => favori.idItemCyber));
    }
  );

  return routeur;
};

export { ressourceFavoris };
