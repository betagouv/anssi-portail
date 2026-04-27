import { Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';
import { fabriqueGestionnaireRessourceCellar } from './gestionnaireRessourceCellar';
import { corpsVide, valideCorpsRequete } from './zod';

export const ressourceVisa = ({ cellar }: ConfigurationServeur): Router => {
  const routeur = Router();

  routeur.get('/:slug', valideCorpsRequete(corpsVide), fabriqueGestionnaireRessourceCellar(cellar, 'VISAS'));

  return routeur;
};
