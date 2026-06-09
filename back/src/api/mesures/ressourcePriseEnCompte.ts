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

  routeur.put(
    '/:idMesure/prise-en-compte',
    middleware.verifieJWT,
    valideCorpsRequete(corpsVide),
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const utilisateur = requete.utilisateur;
      const idMesure = requete.params.idMesure as string;

      const toutesLesMesures = await entrepotMesure.tous();
      const rang = toutesLesMesures.sort((a, b) => a.ordre - b.ordre).findIndex((m) => m.id === idMesure);
      if (rang < 0) {
        return reponse.sendStatus(404);
      }
      const mesure = toutesLesMesures[rang];

      await entrepotPriseEnCompte.ajoute(new PriseEnCompte(utilisateur, mesure));
      await busEvenements.publie(
        new MesurePriseEnCompte(utilisateur.emailHache, mesure.id, toutesLesMesures.length, rang + 1)
      );

      return reponse.sendStatus(201);
    })
  );

  return routeur;
};
