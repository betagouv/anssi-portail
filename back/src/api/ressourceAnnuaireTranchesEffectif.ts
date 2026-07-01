import { Request, Response, Router } from 'express';
import { tranchesEffectifEtablissement } from '../metier/referentielTranchesEffectifEtablissement.js';
import { ConfigurationServeur } from './configurationServeur.js';
import { corpsVide, valideCorpsRequete } from './zod.js';

const ressourceAnnuaireTranchesEffectif = (_: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', valideCorpsRequete(corpsVide), (_: Request, reponse: Response) => {
    reponse.send(tranchesEffectifEtablissement);
  });
  return routeur;
};

export { ressourceAnnuaireTranchesEffectif };
