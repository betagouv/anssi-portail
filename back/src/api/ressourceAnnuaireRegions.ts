import { ConfigurationServeur } from './configurationServeur';
import { Request, Response, Router } from 'express';
import { regions } from '../metier/referentielRegions';

const ressourceAnnuaireRegions = (_: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', (_: Request, reponse: Response) => {
    reponse.send(regions);
  });
  return routeur;
};

export { ressourceAnnuaireRegions };
