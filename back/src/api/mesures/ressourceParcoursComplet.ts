import { Router } from 'express';
import { valideCorpsRequete, corpsVide } from '../zod.js';
import { ConfigurationServeur } from '../configurationServeur.js';

export const ressourceParcoursComplet = ({ middleware, entrepôtModule }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('', middleware.verifieJWT, valideCorpsRequete(corpsVide), async (_requete, reponse) => {
    reponse.send({
      modules: await entrepôtModule.tous(),
    });
  });

  return routeur;
};
