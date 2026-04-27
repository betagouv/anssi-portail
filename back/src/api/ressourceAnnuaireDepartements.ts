import { Request, Response, Router } from 'express';
import { departements } from '../metier/referentielDepartements';
import { ConfigurationServeur } from './configurationServeur';
import { corpsVide, valideCorpsRequete } from './zod';

const ressourceAnnuaireDepartements = (_: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', valideCorpsRequete(corpsVide), (_: Request, reponse: Response) => {
    reponse.send(departements);
  });
  return routeur;
};

export { ressourceAnnuaireDepartements };
