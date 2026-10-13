import { Express, RequestHandler } from 'express';
import { ConfigurationServeur } from '../../configurationServeur.js';
import { ressourceControleContenuListeConfiance } from '../../ressourceControleContenuListeConfiance.js';
import { ressourceVisa } from '../../ressourceVisa.js';
import { enregistreRouteDansExpress } from '../enregistreRoutes.js';

export const enregistreLesVisas = (app: Express, configurationServeur: ConfigurationServeur) => {
  const enregistreRoute = (suffixe: string, ...gestionnaires: RequestHandler[]) =>
    enregistreRouteDansExpress(app)(`/visas${suffixe}`, ...gestionnaires);

  enregistreRoute('/tl-fr.sha2', ressourceControleContenuListeConfiance({ version: 'v5' }));
  enregistreRoute('/tl-fr_v6.sha2', ressourceControleContenuListeConfiance({ version: 'v6' }));
  enregistreRoute('', ressourceVisa(configurationServeur));
};
