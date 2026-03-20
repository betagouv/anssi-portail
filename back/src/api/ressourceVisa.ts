import { Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';
import { fabriqueGestionnaireRessourceCellar } from './gestionnaireRessourceCellar';

export const ressourceVisa = ({ cellar }: ConfigurationServeur): Router => {
  const routeur = Router();

  routeur.get('/:slug', fabriqueGestionnaireRessourceCellar(cellar, 'VISAS'));

  return routeur;
};
