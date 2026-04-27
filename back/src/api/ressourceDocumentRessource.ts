import { Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';
import { fabriqueGestionnaireRessourceCellar } from './gestionnaireRessourceCellar';
import { corpsVide, valideCorpsRequete } from './zod';

export const ressourceDocumentRessource = ({ cellar }: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get('/:slug', valideCorpsRequete(corpsVide), fabriqueGestionnaireRessourceCellar(cellar, 'RESSOURCES_CYBER'));

  return routeur;
};
