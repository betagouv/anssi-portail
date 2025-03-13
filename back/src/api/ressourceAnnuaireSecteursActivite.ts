import { ConfigurationServeur } from './configurationServeur';
import { Request, Response, Router } from 'express';
import { secteurs } from '../metier/referentielSecteurs';

const ressourceAnnuaireSecteursActivite = (_: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', (_: Request, reponse: Response) => {
    reponse.send(secteurs);
  });
  return routeur;
};

export { ressourceAnnuaireSecteursActivite };
