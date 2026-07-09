import { Router } from 'express';
import { valideCorpsRequete, corpsVide } from '../zod.js';

export const ressourceParcoursComplet = () => {
  const routeur = Router();
  routeur.get('', valideCorpsRequete(corpsVide), (_requete, reponse) => reponse.send(200));

  return routeur;
};
