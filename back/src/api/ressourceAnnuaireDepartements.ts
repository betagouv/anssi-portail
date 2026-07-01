import { Request, Response, Router } from 'express';
import { departements } from '../metier/referentielDepartements.js';
import { ConfigurationServeur } from './configurationServeur.js';
import { corpsVide, valideCorpsRequete } from './zod.js';

const ressourceAnnuaireDepartements = (_: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', valideCorpsRequete(corpsVide), (_: Request, reponse: Response) => {
    reponse.send(departements);
  });
  return routeur;
};

export { ressourceAnnuaireDepartements };
