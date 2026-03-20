import { Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';
import { fabriqueGestionnaireRessourceCellar } from './gestionnaireRessourceCellar';

export const ressourceDocumentRessource = ({ cellar }: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get('/:slug', fabriqueGestionnaireRessourceCellar(cellar, 'RESSOURCES_CYBER'));

  return routeur;
};
