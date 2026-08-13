import { NextFunction, Request, Response } from 'express';
import { EntrepotMesure } from '../../metier/entrepotMesure.js';
import { EntrepôtModule } from '../../metier/EntrepotModule.js';
import { IdMesure } from '../../metier/mesure.js';
import { GestionnaireRequêtesComplémentaires } from './middleware.js';

export const fabriqueAttributionParcoursMesure =
  ({
    entrepotMesure,
    entrepôtModule,
    attributionParcours,
  }: {
    entrepotMesure: EntrepotMesure;
    entrepôtModule: EntrepôtModule;
    attributionParcours: GestionnaireRequêtesComplémentaires['attributionParcours'];
  }): GestionnaireRequêtesComplémentaires['publieMesureConsultée'] =>
  async (requête: Request, réponse: Response, suite: NextFunction) => {
    const paramètreIdMesure = requête.params.id as string;
    const idMesure = new IdMesure(paramètreIdMesure);
    if (!idMesure.estValide()) return suite();

    const mesure = await entrepotMesure.parId(paramètreIdMesure);
    if (!mesure?.idModule) return suite();

    const module = await entrepôtModule.pourLaMesure(mesure);
    const parcours = module.estCyberdépart() ? 'allégé' : 'complet';

    return attributionParcours(parcours)(requête, réponse, suite);
  };
