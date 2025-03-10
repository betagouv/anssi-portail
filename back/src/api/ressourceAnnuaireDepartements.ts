import {ConfigurationServeur} from './configurationServeur';
import {Response, Request, Router} from 'express';
import {departements} from "../metier/referentielDepartements";

const ressourceAnnuaireDepartements = (_: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', (_: Request, reponse: Response) => {
    reponse.send(departements);
  });
  return routeur;
};

export {ressourceAnnuaireDepartements};
