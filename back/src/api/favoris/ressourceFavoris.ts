import { HttpStatusCode } from '@anssi-portail/axios';
import { Request, Response, Router } from 'express';
import z from 'zod';
import { MiseAJourFavorisUtilisateur } from '../../bus/miseAJourFavorisUtilisateur.js';
import { ConfigurationServeur } from '../configurationServeur.js';
import { filetRouteAsynchrone } from '../middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from '../zod.js';
import { schemaRessourceFavoris } from './ressourceFavoris.schema.js';
import CorpsDeRequeteTypee = Express.CorpsDeRequeteTypee;

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
    filetRouteAsynchrone(
      async (requete: CorpsDeRequeteTypee<z.infer<typeof schemaRessourceFavoris>>, reponse: Response) => {
        const idItemCyber = requete.body.idItemCyber;
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
        reponse.sendStatus(HttpStatusCode.Created);
      }
    )
  );

  routeur.get(
    '/',
    middleware.verifieJWT,
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const utilisateur = requete.utilisateur;
      const favoris = await entrepotFavori.tousCeuxDeUtilisateur(utilisateur);
      reponse.status(HttpStatusCode.Ok).send(favoris.map((favori) => favori.idItemCyber));
    })
  );

  return routeur;
};

export { ressourceFavoris };
