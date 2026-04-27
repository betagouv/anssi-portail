import { Request, Response, Router } from 'express';
import { secteurs } from '../metier/referentielSecteurs';
import { ConfigurationServeur } from './configurationServeur';
import { corpsVide, valideCorpsRequete } from './zod';

const ressourceAnnuaireSecteursActivite = (_: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', valideCorpsRequete(corpsVide), (_: Request, reponse: Response) => {
    reponse.send(secteurs);
  });
  return routeur;
};

export { ressourceAnnuaireSecteursActivite };
