import { Router } from 'express';
import { ConfigurationServeur } from './configurationServeur.js';
import { fabriqueGestionnaireRessourceCellar } from './gestionnaireRessourceCellar.js';
import { corpsVide, valideCorpsRequete } from './zod.js';

export const ressourceDocumentRessource = ({ cellar }: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get('/:slug', valideCorpsRequete(corpsVide), fabriqueGestionnaireRessourceCellar(cellar, 'RESSOURCES_CYBER'));

  return routeur;
};
