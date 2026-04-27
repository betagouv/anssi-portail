import cors from 'cors';
import { Router } from 'express';
import { corpsVide, valideCorpsRequete } from './zod';

export const STATS_DIAGNOSTIC = {
  organisationsAccompagnees: 5000,
  satisfaction: 92,
};

export const ressourceStatistiquesDiagnostic = () => {
  const routeur = Router();
  routeur.get('/', cors(), valideCorpsRequete(corpsVide), (_requete, reponse) => {
    reponse.send(STATS_DIAGNOSTIC);
  });
  return routeur;
};
