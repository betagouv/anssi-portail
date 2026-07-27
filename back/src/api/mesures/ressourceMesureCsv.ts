import { Request, Response, Router } from 'express';
import { filetRouteAsynchrone } from '../middleware.js';
import { corpsVide, valideCorpsRequete } from '../zod.js';
import { ConfigurationServeur } from '../configurationServeur.js';
import { createObjectCsvStringifier } from 'csv-writer';
import { Module } from '../../metier/module.js';
import { ObjectHeaderItem } from 'csv-writer/src/lib/record.js';

const ressourceMesureCsv = ({ entrepôtModule, middleware }: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get(
    '/',
    middleware.verifieJWT,
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (_requete: Request, reponse: Response) => {
      const HEADERS: ObjectHeaderItem[] = [
        { id: 'module', title: 'Titre du module' },
        { id: 'mesure', title: 'Titre de la mesure' },
        { id: 'description', title: 'Description de la mesure' },
      ];
      const modules: Module[] = await entrepôtModule.tous();

      const mesuresMappées: Record<string, string>[] = modules.reduce(
        (acc, actuel) => {
          acc.push(
            ...actuel.mesures.map((mesure) => ({
              module: actuel.nom,
              mesure: mesure.titre,
              description: mesure.explications,
            }))
          );
          return acc;
        },
        [] as Record<string, string>[]
      );

      const stringifier = createObjectCsvStringifier({
        fieldDelimiter: ';',
        alwaysQuote: true,
        header: HEADERS,
      });

      const csv: string = `\uFEFF${stringifier.getHeaderString()}${stringifier.stringifyRecords(mesuresMappées)}`;

      reponse.attachment('mesures.csv').send(csv);
    })
  );

  return routeur;
};

export { ressourceMesureCsv };
