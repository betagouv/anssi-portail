import { pipeline } from 'node:stream/promises';
import { HttpStatusCode } from '@anssi-portail/axios';
import { Request, Response, Router } from 'express';
import { OutilTéléchargé } from '../../../bus/evenements/outilTelecharge.js';
import { Utilisateur } from '../../../metier/utilisateur.js';
import { ConfigurationServeur } from '../../configurationServeur.js';
import { filetRouteAsynchrone } from '../../middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from '../../zod.js';

const NOM_DU_FICHIER_DANS_CELLAR = 'campagne-de-sensibilisation-V1.zip';
const NOM_DU_FICHIER_TÉLÉCHARGÉ = 'ANSSI - Campagne de sensibilisation.zip';

export const ressourceCampagneDeSensibilisation = ({
  adaptateurHachage,
  busEvenements,
  cellar,
  entrepotUtilisateur,
  middleware,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/',
    middleware.verifieJWT,
    valideCorpsRequete(corpsVide),
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    filetRouteAsynchrone(async (requête: Request, réponse: Response) => {
      const utilisateur: Utilisateur = requête.utilisateur;

      const fluxCellar = await cellar.getStream(NOM_DU_FICHIER_DANS_CELLAR, 'RESSOURCES_CYBER');
      if (!fluxCellar) {
        réponse.sendStatus(HttpStatusCode.NotFound);
        return;
      }

      await busEvenements.publie(new OutilTéléchargé(utilisateur.email, 'campagne-de-sensibilisation'));

      réponse.type('application/zip').attachment(NOM_DU_FICHIER_TÉLÉCHARGÉ);
      if (Number.isFinite(fluxCellar.tailleDuContenu)) {
        réponse.setHeader('content-length', fluxCellar.tailleDuContenu);
      }

      try {
        await pipeline(fluxCellar.flux, réponse);
      } catch (erreur: Error | unknown) {
        // Une déconnexion volontaire du client n'est pas une erreur serveur
        if (!réponse.destroyed) throw erreur;
      }
    })
  );
  return routeur;
};
