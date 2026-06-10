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
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const mesures = await entrepotMesure.tous();
      const utilisateur = requete.utilisateur as Utilisateur;

      const prisesEnCompteDeLUtilisateur = await entrepotPriseEnCompte.pour(utilisateur);

      const mesuresPresentation = await Promise.all(
        mesures.map(async (mesure) => {
          return mesurePresentation(
            mesure,
            prisesEnCompteDeLUtilisateur.find((pec) => pec.mesure.id === mesure.id)
          );
        })
      );
      const mesuresTries = mesuresPresentation.toSorted((a, b) => a.ordre - b.ordre);
      reponse.status(200).send(mesuresTries);
    })
  );

  return routeur;
};

export { ressourceMesuresDeModule };
