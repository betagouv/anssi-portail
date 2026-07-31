import { Router } from 'express';
import { Utilisateur } from '../../../metier/utilisateur.js';
import { ConfigurationServeur } from '../../configurationServeur.js';
import { filetRouteAsynchrone } from '../../middleware.js';
import { corpsVide, valideCorpsRequete } from '../../zod.js';

export const ressourceRécompensesCyberDépart = ({
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
        return reponse.sendStatus(500);
      }

      const cibleBadgeCyberdépart = moduleCyberdépart.cibleDéblocageBadgeCyberdépart()!;
      const utilisateur = requete.utilisateur as Utilisateur;
      if (utilisateur.nombreDeMesuresPrisesEnCompte(moduleCyberdépart) < cibleBadgeCyberdépart) {
        return reponse.sendStatus(403);
      }

      const nomOrganisation = (await (requete.utilisateur as Utilisateur).organisation()).nom;
      const banniere = await serviceRécompensesCyberDépart.genereBanniere({
        nomOrganisation,
      });

      const archive = await adaptateurCompression.génèreArchive([{ nom: 'banniere.png', buffer: banniere }]);

      return reponse.contentType('application/zip').attachment('recompenses.zip').send(archive);
    })
  );

  return routeur;
};
