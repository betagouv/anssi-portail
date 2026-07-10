import { Router } from 'express';
import { valideCorpsRequete, corpsVide } from '../zod.js';
import { ConfigurationServeur } from '../configurationServeur.js';

export const ressourceParcoursComplet = ({ middleware, entrepôtModule }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('', middleware.verifieJWT, valideCorpsRequete(corpsVide), async (_requete, reponse) => {
    const modules = await entrepôtModule.tous();
    reponse.send({
      modules: modules.map((module) => ({
        ...module,
        nombreMesuresTotal: module.nombreDeMesures(),
        cibleBadge: module.cibleDéblocageBadgeCyberdépart(),
      })),
    });
  });

  return routeur;
};
