import { Request, Response, Router } from 'express';
import { Utilisateur } from '../../metier/utilisateur.js';
import { ConfigurationServeur } from '../configurationServeur.js';
import { filetRouteAsynchrone } from '../middleware.js';
import { valideParametresRequete } from '../zod.js';
import { mesurePresentation } from './mesurePresentation.js';
import { schemaRessourceModule } from './schemaRessourceModule.schema.js';

const ressourceModule = ({
  entrepotUtilisateur,
  entrepôtModule,
  adaptateurHachage,
  middleware,
}: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get(
    '/:idModule',
    middleware.verifieJWT,
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    valideParametresRequete(schemaRessourceModule),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const module = await entrepôtModule.parId(Number.parseInt(requete.params.idModule as string));
      if (!module) {
        return reponse.sendStatus(404);
      }
      const utilisateur = requete.utilisateur as Utilisateur;

      const mesuresPresentation = await Promise.all(
        module.mesures.map(async (mesure) => {
          return mesurePresentation(mesure, utilisateur.estPriseEnCompte(mesure));
        })
      );
      const mesuresTries = mesuresPresentation.toSorted((a, b) => a.ordre - b.ordre);
      reponse
        .status(200)
        .send({ nom: module.nom, cibleBadge: module.cibleDéblocageBadgeCyberdépart(), mesures: mesuresTries });
    })
  );

  return routeur;
};

export { ressourceModule };
