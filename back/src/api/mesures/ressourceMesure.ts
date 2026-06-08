import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';
import { filetRouteAsynchrone } from '../middleware';
import { corpsVide, valideCorpsRequete } from '../zod';
import { mesurePresentation } from './mesurePresentation';

const ressourceMesure = ({
  entrepotMesure,
  entrepotUtilisateur,
  entrepotPriseEnCompte,
  adaptateurHachage,
  middleware,
}: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get(
    '/:idMesure',
    valideCorpsRequete(corpsVide),
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const mesureTrouvee = await entrepotMesure.parId(requete.params.idMesure as string);
      if (!mesureTrouvee) {
        return reponse.sendStatus(404);
      }

      const utilisateur = requete.utilisateur;
      const priseEnCompte = await entrepotPriseEnCompte.pour(utilisateur, mesureTrouvee);

      const mesurePresentee = await mesurePresentation(mesureTrouvee, priseEnCompte);
      reponse.status(200).send(mesurePresentee);
    })
  );

  return routeur;
};

export { ressourceMesure };
