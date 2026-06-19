import { Request, Response, Router } from 'express';
import { Utilisateur } from '../../metier/utilisateur';
import { ConfigurationServeur } from '../configurationServeur';
import { filetRouteAsynchrone } from '../middleware';
import { corpsVide, valideCorpsRequete } from '../zod';
import { mesurePresentation } from './mesurePresentation';

const ressourceMesuresDeModule = ({
  entrepotMesure,
  entrepotUtilisateur,
  entrepôtModule,
  adaptateurHachage,
  middleware,
}: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get(
    '/:idModule/mesures',
    middleware.verifieJWT,
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const module = await entrepôtModule.parId(Number.parseInt(requete.params.idModule as string));
      if (!module) {
        return reponse.sendStatus(404);
      }
      const mesures = await entrepotMesure.duModule(module!);
      const utilisateur = requete.utilisateur as Utilisateur;

      const mesuresPresentation = await Promise.all(
        mesures.map(async (mesure) => {
          return mesurePresentation(mesure, utilisateur.estPriseEnCompte(mesure));
        })
      );
      const mesuresTries = mesuresPresentation.toSorted((a, b) => a.ordre - b.ordre);
      reponse.status(200).send(mesuresTries);
    })
  );

  return routeur;
};

export { ressourceMesuresDeModule };
