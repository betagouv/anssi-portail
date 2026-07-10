import { Router } from 'express';
import { valideCorpsRequete, corpsVide } from '../zod.js';
import { ConfigurationServeur } from '../configurationServeur.js';

export const ressourceParcoursComplet = ({ middleware }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('', middleware.verifieJWT, valideCorpsRequete(corpsVide), (_requete, reponse) => reponse.send(200));

  return routeur;
};
