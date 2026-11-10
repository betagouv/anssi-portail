import { HttpStatusCode } from '@anssi-portail/axios';
import { Response, Router } from 'express';
import z from 'zod';
import { AvisParcoursDonné } from '../bus/evenements/avisParcoursDonne.js';
import { AvisParcours } from '../metier/messagerieInstantanee.js';
import { Parcours } from '../metier/parcours.js';
import { Utilisateur } from '../metier/utilisateur.js';
import { ConfigurationServeur } from './configurationServeur.js';
import { filetRouteAsynchrone } from './middlewares/middleware.js';
import { schemaRessourceAvisParcours } from './ressourceAvisParcours.schema.js';
import { valideCorpsRequete } from './zod.js';

import CorpsDeRequeteTypee = Express.CorpsDeRequeteTypee;

export const ressourceAvisParcours = ({
  busEvenements,
  messagerieInstantanee,
  entrepotUtilisateur,
  middleware,
  adaptateurHachage,
  rapporteur,
}: ConfigurationServeur): Router => {
  const routeur = Router();
  routeur.post(
    '/',
    middleware.verifieJWT,
    valideCorpsRequete(schemaRessourceAvisParcours),
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    filetRouteAsynchrone(
      async (requête: CorpsDeRequeteTypee<z.output<typeof schemaRessourceAvisParcours>>, réponse: Response) => {
        const { niveauDUtilité, recommandationAutreOrganisation, commentaireAmélioration, souhaiteÊtreRecontacté } =
          requête.body;
        const utilisateur = requête.utilisateur as Utilisateur;
        const parcours = utilisateur?.parcoursActuel();

        const parcoursActuelConfiguré = (parcours: Utilisateur['parcours']): parcours is Parcours => {
          if (!parcours) return false;
          return ['allégé', 'complet'].includes(parcours);
        };

        if (!parcoursActuelConfiguré(parcours)) {
          rapporteur.erreur(`Impossible de poster un avis parcours pour cet utilisateur: ${utilisateur.emailHache}`);
          return réponse.sendStatus(500);
        }
        const pageSource = requête.query.pageSource as string | undefined;
        const contenu: AvisParcours = {
          niveauDUtilité,
          recommandationAutreOrganisation,
          commentaireAmélioration,
          souhaiteÊtreRecontacté,
          pageSource,
          emailDeContact: utilisateur.email,
          parcours,
        };
        await messagerieInstantanee.notifieUnAvisParcours(contenu);
        await busEvenements.publie(new AvisParcoursDonné(contenu));
        réponse.sendStatus(HttpStatusCode.Created);
      }
    )
  );
  return routeur;
};
