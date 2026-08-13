import { NextFunction, Request, Response } from 'express';
import { IdMesure } from '../../metier/mesure.js';
import { ConfigurationServeur } from '../configurationServeur.js';

export const attributionParcoursMesure =
  (configurationServeur: ConfigurationServeur) => async (requête: Request, réponse: Response, suite: NextFunction) => {
    const paramètreIdMesure = requête.params.id as string;
    const idMesure = new IdMesure(paramètreIdMesure);
    if (!idMesure.estValide()) return suite();

    const mesure = await configurationServeur.entrepotMesure.parId(paramètreIdMesure);
    if (!mesure?.idModule) return suite();

    const module = await configurationServeur.entrepôtModule.pourLaMesure(mesure);
    const parcours = module.estCyberdépart() ? 'allégé' : 'complet';
    const { attributionParcours } = configurationServeur.gestionnairesRequêtesComplémentaires;
    return attributionParcours(configurationServeur)(parcours)(requête, réponse, suite);
  };
