import { Request, Response, Router } from 'express';
import { Utilisateur } from '../../metier/utilisateur.js';
import { ConfigurationServeur } from '../configurationServeur.js';
import { filetRouteAsynchrone } from '../middleware.js';
import { corpsVide, valideCorpsRequete } from '../zod.js';
import { mesurePresentation } from './mesurePresentation.js';

const ressourceMesure = ({
  entrepotMesure,
  entrepotUtilisateur,
  adaptateurHachage,
  middleware,
}: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get(
    '/:idMesure',
    middleware.verifieJWT,
    valideCorpsRequete(corpsVide),
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const mesureTrouvee = await entrepotMesure.parId(requete.params.idMesure as string);
      if (!mesureTrouvee) {
        return reponse.sendStatus(404);
      }

      const utilisateur = requete.utilisateur as Utilisateur | undefined;
      const estPriseEnCompte = utilisateur?.estPriseEnCompte(mesureTrouvee) ?? false;

      const mesurePresentee = await mesurePresentation(mesureTrouvee, estPriseEnCompte);
      reponse.status(200).send(mesurePresentee);
    })
  );

  return routeur;
};

export { ressourceMesure };
