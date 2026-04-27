import { Request, Response, Router } from 'express';
import { tranchesEffectifEtablissement } from '../metier/referentielTranchesEffectifEtablissement';
import { ConfigurationServeur } from './configurationServeur';
import { corpsVide, valideCorpsRequete } from './zod';

const ressourceAnnuaireTranchesEffectif = (_: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', valideCorpsRequete(corpsVide), (_: Request, reponse: Response) => {
    reponse.send(tranchesEffectifEtablissement);
  });
  return routeur;
};

export { ressourceAnnuaireTranchesEffectif };
