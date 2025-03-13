import { ConfigurationServeur } from './configurationServeur';
import { Request, Response, Router } from 'express';
import { tranchesEffectifEtablissement } from '../metier/referentielTranchesEffectifEtablissement';

const ressourceAnnuaireTranchesEffectif = (_: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', (_: Request, reponse: Response) => {
    reponse.send(tranchesEffectifEtablissement);
  });
  return routeur;
};

export { ressourceAnnuaireTranchesEffectif };
