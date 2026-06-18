import { Request, Response, Router } from 'express';
import { Utilisateur } from '../../metier/utilisateur';
import { ConfigurationServeur } from '../configurationServeur';
import { filetRouteAsynchrone } from '../middleware';
import { corpsVide, valideCorpsRequete } from '../zod';

export const ressourcePriseEnCompte = ({
  middleware,
  entrepotUtilisateur,
  adaptateurHachage,
  entrepotMesure,
  entrepotPriseEnCompte,
  busEvenements,
}: ConfigurationServeur) => {
  const routeur = Router();

  routeur.put(
    '/:idMesure/prise-en-compte',
    middleware.verifieJWT,
    valideCorpsRequete(corpsVide),
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const utilisateur = requete.utilisateur as Utilisateur;
      const idMesure = requete.params.idMesure as string;

      const toutesLesMesures = await entrepotMesure.tous();
      const rang = toutesLesMesures.sort((a, b) => a.ordre - b.ordre).findIndex((m) => m.id === idMesure);
      if (rang < 0) {
        return reponse.sendStatus(404);
      }
      const mesure = toutesLesMesures[rang];

      await utilisateur.prendEnCompte(mesure, toutesLesMesures, rang, entrepotPriseEnCompte, busEvenements);

      return reponse.sendStatus(201);
    })
  );

  return routeur;
};
