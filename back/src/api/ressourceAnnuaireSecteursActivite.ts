import { Request, Response, Router } from 'express';
import { secteurs } from '../metier/referentielSecteurs.js';
import { ConfigurationServeur } from './configurationServeur.js';
import { corpsVide, valideCorpsRequete } from './zod.js';

const ressourceAnnuaireSecteursActivite = (_: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', valideCorpsRequete(corpsVide), (_: Request, reponse: Response) => {
    reponse.send(secteurs);
  });
  return routeur;
};

export { ressourceAnnuaireSecteursActivite };
