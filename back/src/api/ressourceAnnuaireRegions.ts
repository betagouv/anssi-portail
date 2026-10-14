import cors from 'cors';
import { Request, Response, Router } from 'express';
import { régions } from '../metier/referentielRegions.js';
import { ConfigurationServeur } from './configurationServeur.js';
import { corpsVide, valideCorpsRequete } from './zod.js';

const ressourceAnnuaireRegions = (_: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', cors(), valideCorpsRequete(corpsVide), (_: Request, reponse: Response) => {
    reponse.send(régions);
  });
  return routeur;
};

export { ressourceAnnuaireRegions };
