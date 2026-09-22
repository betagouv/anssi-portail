import { HttpStatusCode } from '@anssi-portail/axios';
import { Router } from 'express';
import { Utilisateur } from '../../../metier/utilisateur.js';
import { ConfigurationServeur } from '../../configurationServeur.js';
import { filetRouteAsynchrone } from '../../middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from '../../zod.js';

export const ressourceRécompensesCyberDépartSansBadge = ({
  serviceRécompensesCyberDépart,
  entrepotUtilisateur,
  entrepôtModule,
  adaptateurHachage,
  adaptateurCompression,
  middleware,
}: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get(
    '/',
    middleware.verifieJWT,
    valideCorpsRequete(corpsVide),
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    filetRouteAsynchrone(async (requete, reponse) => {
      const ID_MODULE_CYBERDEPART = 1;
      const moduleCyberdépart = await entrepôtModule.parId(ID_MODULE_CYBERDEPART);
      if (!moduleCyberdépart) {
        return reponse.sendStatus(HttpStatusCode.InternalServerError);
      }

      const cibleBadgeCyberdépart = moduleCyberdépart.cibleDéblocageBadgeCyberdépart()!;
      const utilisateur = requete.utilisateur as Utilisateur;
      if (utilisateur.nombreDeMesuresPrisesEnCompte(moduleCyberdépart) < cibleBadgeCyberdépart) {
        return reponse.sendStatus(HttpStatusCode.Forbidden);
      }

      const nomOrganisation = (await (requete.utilisateur as Utilisateur).organisation()).nom;
      const banniere = await serviceRécompensesCyberDépart.genereBanniere({
        nomOrganisation,
      });

      const visuel = await serviceRécompensesCyberDépart.récupèreBadge();

      const archive = await adaptateurCompression.génèreArchive([
        { nom: 'banniere.png', buffer: banniere },
        { nom: 'visuel.png', buffer: visuel },
      ]);

      return reponse.contentType('application/zip').attachment('visuels_cyberdepart.zip').send(archive);
    })
  );

  return routeur;
};
