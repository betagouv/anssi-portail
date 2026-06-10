import { Response, Router } from 'express';
import z from 'zod';
import { AvisMesureDonne } from '../../bus/evenements/avisMesureDonne';
import { ConfigurationServeur } from '../configurationServeur';
import { filetRouteAsynchrone } from '../middleware';
import { valideCorpsRequete } from '../zod';
import { schemaRessourceAvisMesure } from './ressourceAvisMesure.schema';
import CorpsDeRequeteTypee = Express.CorpsDeRequeteTypee;

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
          return reponse.sendStatus(404);
        }

        await busEvenements.publie(
          new AvisMesureDonne({
            idUtilisateur: requete.utilisateur.emailHache,
            idMesure,
            retour,
            ...(retour === 'NEGATIF' && { commentaire: requete.body.commentaire }),
          })
        );

        reponse.status(201).send();
      }
    )
  );

  return routeur;
};

export { ressourceAvisMesure };
