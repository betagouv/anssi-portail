import { Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';
import { corpsVide, valideCorpsRequete } from './zod';

export const ressourceInfosSite = ({ adaptateurEnvironnement }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', valideCorpsRequete(corpsVide), (_, reponse) => {
    const detailsPreparation = adaptateurEnvironnement.maintenance().detailsPreparation();
    const maintenanceEnPreparation = detailsPreparation
      ? {
          jour: detailsPreparation.split(' - ')[0],
          heure: detailsPreparation.split(' - ')[1],
        }
      : undefined;
    reponse.json({ maintenanceEnPreparation });
  });
  return routeur;
};
