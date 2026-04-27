import { Request, Response, Router } from 'express';
import { regions } from '../metier/referentielRegions';
import { ConfigurationServeur } from './configurationServeur';
import { corpsVide, valideCorpsRequete } from './zod';

const ressourceAnnuaireRegions = (_: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', valideCorpsRequete(corpsVide), (_: Request, reponse: Response) => {
    reponse.send(regions);
  });
  return routeur;
};

export { ressourceAnnuaireRegions };
