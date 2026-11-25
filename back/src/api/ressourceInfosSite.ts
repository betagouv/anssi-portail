import { Router } from 'express';
import { ConfigurationServeur } from './configurationServeur.js';
import { corpsVide, valideCorpsRequete } from './zod.js';

export const previsionMaintenance = (adaptateurEnvironnement: ConfigurationServeur['adaptateurEnvironnement']) => {
  const detailsPreparation = adaptateurEnvironnement.maintenance.detailsPreparation();
  return detailsPreparation
    ? {
        jour: detailsPreparation.split(' - ')[0],
        heure: detailsPreparation.split(' - ')[1],
      }
    : undefined;
};

export const ressourceInfosSite = ({ adaptateurEnvironnement }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', valideCorpsRequete(corpsVide), (_, reponse) => {
    reponse.json({ maintenanceEnPreparation: previsionMaintenance(adaptateurEnvironnement) });
  });
  return routeur;
};
