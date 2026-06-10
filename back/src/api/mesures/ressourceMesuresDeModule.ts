import { Request, Response, Router } from 'express';
import { Utilisateur } from '../../metier/utilisateur';
import { ConfigurationServeur } from '../configurationServeur';
import { filetRouteAsynchrone } from '../middleware';
import { corpsVide, valideCorpsRequete } from '../zod';
import { mesurePresentation } from './mesurePresentation';

const ressourceMesuresDeModule = ({
  entrepotMesure,
  entrepotUtilisateur,
  entrepotPriseEnCompte,
  adaptateurHachage,
  middleware,
}: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get(
    '/',
    middleware.verifieJWT,
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (_requete: Request, reponse: Response) => {
      const mesures = await entrepotMesure.tous();
      const utilisateur = _requete.utilisateur as Utilisateur;
      const mesuresPresentation = await Promise.all(
        mesures.map(async (mesure) => {
          const priseEnCompte = await entrepotPriseEnCompte.pour(utilisateur, mesure);
          return mesurePresentation(mesure, priseEnCompte);
        })
      );
      const mesuresTries = mesuresPresentation.toSorted((a, b) => a.ordre - b.ordre);
      reponse.status(200).send(mesuresTries);
    })
  );

  return routeur;
};

export { ressourceMesuresDeModule };
