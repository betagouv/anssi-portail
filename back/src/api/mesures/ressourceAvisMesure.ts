import { HttpStatusCode } from '@anssi-portail/axios';
import { Response, Router } from 'express';
import z from 'zod';
import { AvisMesureDonne } from '../../bus/evenements/avisMesureDonne.js';
import { ConfigurationServeur } from '../configurationServeur.js';
import { filetRouteAsynchrone } from '../middlewares/middleware.js';
import { valideCorpsRequete } from '../zod.js';
import { schemaRessourceAvisMesure } from './ressourceAvisMesure.schema.js';
import CorpsDeRequeteTypee = Express.CorpsDeRequeteTypee;
import { Utilisateur } from '../../metier/utilisateur.js';

const ressourceAvisMesure = ({
  entrepotMesure,
  busEvenements,
  middleware,
  entrepotUtilisateur,
  adaptateurHachage,
}: ConfigurationServeur) => {
  const routeur = Router();

  routeur.post(
    '/:idMesure/avis',
    middleware.verifieJWT,
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    valideCorpsRequete(schemaRessourceAvisMesure),
    filetRouteAsynchrone(
      async (requete: CorpsDeRequeteTypee<z.infer<typeof schemaRessourceAvisMesure>>, reponse: Response) => {
        const idMesure = requete.params.idMesure as string;
        const retour = requete.body.retour;
        const mesureTrouvee = await entrepotMesure.parId(idMesure);
        if (!mesureTrouvee) {
          return reponse.sendStatus(HttpStatusCode.NotFound);
        }
        const utilisateur = requete.utilisateur as Utilisateur;

        await busEvenements.publie(
          new AvisMesureDonne({
            idUtilisateur: utilisateur.emailHache(),
            idMesure,
            parcours: utilisateur.parcoursActuel() ?? undefined,
            titreMesure: mesureTrouvee.titre,
            retour,
            ...(retour === 'NEGATIF' && { commentaire: requete.body.commentaire }),
          })
        );

        reponse.status(HttpStatusCode.Created).send();
      }
    )
  );

  return routeur;
};

export { ressourceAvisMesure };
