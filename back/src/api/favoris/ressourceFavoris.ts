import { Request, Response, Router } from 'express';
import { MiseAJourFavorisUtilisateur } from '../../bus/miseAJourFavorisUtilisateur';
import { ConfigurationServeur } from '../configurationServeur';
import { filetRouteAsynchrone } from '../middleware';
import { corpsVide, valideCorpsRequete } from '../zod';
import { schemaRessourceFavoris } from './ressourceFavoris.schema';

const ressourceFavoris = ({
  busEvenements,
  middleware,
  entrepotFavori,
  entrepotUtilisateur,
  adaptateurHachage,
}: ConfigurationServeur) => {
  const routeur = Router();

  routeur.post(
    '/',
    middleware.verifieJWT,
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    valideCorpsRequete(schemaRessourceFavoris),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const idItemCyber = requete.body.idItemCyber as string;
      const utilisateur = requete.utilisateur;
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
    })
  );

  routeur.get(
    '/',
    middleware.verifieJWT,
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const utilisateur = requete.utilisateur;
      const favoris = await entrepotFavori.tousCeuxDeUtilisateur(utilisateur);
      reponse.status(200).send(favoris.map((favori) => favori.idItemCyber));
    })
  );

  return routeur;
};

export { ressourceFavoris };
