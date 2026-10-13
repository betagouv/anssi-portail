import { HttpStatusCode } from '@anssi-portail/axios';
import { Express, RequestHandler } from 'express';
import { ConfigurationServeur } from '../../configurationServeur.js';
import { ressourcePagesJekyll } from '../../ressourcePagesJekyll.js';
import { enregistreRouteDansExpress } from '../enregistreRoutes.js';

export const enregistreLesFinancements = (app: Express, configurationServeur: ConfigurationServeur) => {
  const enregistreRoute = (suffixe: string, ...gestionnaires: RequestHandler[]) =>
    enregistreRouteDansExpress(app)(`/financements${suffixe}`, ...gestionnaires);

  enregistreRoute('', (requête, réponse) => {
    const id = requête.query.idFinancement;
    if (Object.keys(requête.query).length > 0 && id) {
      // on garde la redirection pour ne pas casser les liens existants
      return réponse.redirect(HttpStatusCode.MovedPermanently, `/financements/${id}`);
    }
    réponse
      .contentType('text/html')
      .status(HttpStatusCode.Ok)
      .envoieFichierEnrichi(configurationServeur.fournisseurChemin.jekyll.page('financements'));
  });

  enregistreRoute('/:id', ressourcePagesJekyll(configurationServeur, 'financements'));
};
