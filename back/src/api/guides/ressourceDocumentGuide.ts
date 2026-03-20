import { Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';
import { fabriqueGestionnaireRessourceCellar } from '../gestionnaireRessourceCellar';

export const ressourceDocumentGuide = ({ cellar }: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get('/:slug', fabriqueGestionnaireRessourceCellar(cellar, 'GUIDES'));

  return routeur;
};
