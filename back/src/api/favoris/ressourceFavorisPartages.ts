import { HttpStatusCode } from '@anssi-portail/axios';
import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur.js';
import { filetRouteAsynchrone } from '../middlewares/middleware.js';
import { valideParametresRequete } from '../zod.js';
import { schemaRessourceFavorisPartages } from './ressourceFavorisPartages.schema.js';

const ressourceFavorisPartages = ({ entrepotFavori, entrepotUtilisateur }: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get(
    '/:id',
    valideParametresRequete(schemaRessourceFavorisPartages),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const utilisateurPartageur = await entrepotUtilisateur.parIdListeFavoris(requete.params.id as string);

      if (!utilisateurPartageur) {
        reponse.sendStatus(HttpStatusCode.NotFound);
        return;
      }

      const favoris = await entrepotFavori.tousCeuxDeUtilisateur(utilisateurPartageur);
      const favorisPartages = favoris.map((favori) => favori.idItemCyber);

      reponse.send({
        prenom: utilisateurPartageur.prenom,
        favorisPartages: favorisPartages,
      });
    })
  );
  return routeur;
};

export { ressourceFavorisPartages };
