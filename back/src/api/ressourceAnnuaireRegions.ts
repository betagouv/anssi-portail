import { Request, Response, Router } from 'express';
import { regions } from '../metier/referentielRegions.js';
import { ConfigurationServeur } from './configurationServeur.js';
import { corpsVide, valideCorpsRequete } from './zod.js';

const ressourceAnnuaireRegions = (_: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', valideCorpsRequete(corpsVide), (_: Request, reponse: Response) => {
    reponse.send(regions);
  });
  return routeur;
};

export { ressourceAnnuaireRegions };
