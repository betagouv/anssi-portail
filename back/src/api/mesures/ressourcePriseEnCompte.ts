import { Request, Response, Router } from 'express';
import { MesurePriseEnCompte } from '../../bus/evenements/mesurePriseEnCompte';
import { PriseEnCompte } from '../../metier/PriseEnCompte';
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

  routeur.post(
    '/:idMesure/prise-en-compte',
    middleware.verifieJWT,
    valideCorpsRequete(corpsVide),
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const utilisateur = requete.utilisateur;
      const mesure = await entrepotMesure.parId(requete.params.idMesure as string);
      if (!mesure) {
        return reponse.sendStatus(404);
      }
      await entrepotPriseEnCompte.ajoute(new PriseEnCompte(utilisateur, mesure));

      await busEvenements.publie(new MesurePriseEnCompte(utilisateur.emailHache, mesure.id));

      return reponse.sendStatus(201);
    })
  );

  return routeur;
};
