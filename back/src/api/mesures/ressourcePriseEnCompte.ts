import { Request, Response, Router } from 'express';
import { filetRouteAsynchrone } from '../middleware';
import { corpsVide, valideCorpsRequete } from '../zod';
import { ConfigurationServeur } from '../configurationServeur';
import { Utilisateur } from '../../metier/utilisateur';
import { PriseEnCompte } from '../../metier/PriseEnCompte';

export const ressourcePriseEnCompte = ({
  middleware,
  entrepotUtilisateur,
  adaptateurHachage,
  entrepotMesure,
  entrepotPriseEnCompte,
}: ConfigurationServeur) => {
  const routeur = Router();

  routeur.post(
    '/:idMesure/prise-en-compte',
    middleware.verifieJWT,
    valideCorpsRequete(corpsVide),
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const utilisateur = requete.utilisateur as Utilisateur;
      const mesure = await entrepotMesure.parId(requete.params.idMesure as string);
      if (!mesure) {
        return reponse.sendStatus(404);
      }
      await entrepotPriseEnCompte.ajoute(new PriseEnCompte(utilisateur, mesure));
      return reponse.sendStatus(201);
    })
  );

  return routeur;
};
