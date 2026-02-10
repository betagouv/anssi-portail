import { Router } from 'express';

export const STATS_DIAGNOSTIC = {
  organisationsAccompagnees: 4900,
  satisfaction: 92,
};

export const ressourceStatistiquesDiagnostic = () => {
  const routeur = Router();
  routeur.get('/', (_requete, reponse) => {
    reponse.send(STATS_DIAGNOSTIC);
  });
  return routeur;
};
