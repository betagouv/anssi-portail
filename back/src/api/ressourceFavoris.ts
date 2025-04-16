import { ConfigurationServeur } from './configurationServeur';
import { Request, Response, Router } from 'express';
import { check } from 'express-validator';
import { MiseAJourFavorisUtilisateur } from '../bus/miseAJourFavorisUtilisateur';

const ressourceFavoris = ({
  busEvenements,
  middleware,
  entrepotFavori,
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
      await entrepotFavori.ajoute({
        idItemCyber,
        emailUtilisateur: requete.session?.email,
      });

      const favoris = await entrepotFavori.tousCeuxDeUtilisateur(
        requete.session?.email
      );

      await busEvenements.publie(
        new MiseAJourFavorisUtilisateur({
          email: requete.session?.email,
          listeIdFavoris: favoris.map(({ idItemCyber }) => idItemCyber),
        })
      );
      reponse.sendStatus(201);
    }
  );

  routeur.get(
    '/',
    middleware.verifieJWT,
    async (requete: Request, reponse: Response) => {
      const favoris = await entrepotFavori.tousCeuxDeUtilisateur(
        requete.session?.email
      );
      reponse.status(200).send(favoris.map((favori) => favori.idItemCyber));
    }
  );

  return routeur;
};

export { ressourceFavoris };
