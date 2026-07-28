import { Request, Response, Router } from 'express';
import DOMPurify from 'isomorphic-dompurify';
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
      const FIELD_DELIMITER = ';';
      const HEADERS: ObjectHeaderItem[] = [
        { id: 'module', title: 'Titre du module' },
        { id: 'mesure', title: 'Titre de la mesure' },
        { id: 'description', title: 'Description de la mesure' },
      ];

      const modules: Module[] = await entrepôtModule.tous();

      const mesuresMappées: Record<ObjectHeaderItem['id'], string>[] = modules.flatMap((module) =>
        module.mesures.map((mesure) => ({
          [HEADERS[0].id]: module.nom,
          [HEADERS[1].id]: mesure.titre,
          [HEADERS[2].id]: DOMPurify.sanitize(mesure.explications, { ALLOWED_TAGS: [] }),
        }))
      );

      const stringifier = createObjectCsvStringifier({
        fieldDelimiter: FIELD_DELIMITER,
        alwaysQuote: true,
        header: HEADERS,
      });

      const BOM_CHAR = '\uFEFF';
      const entêteCsv = stringifier.getHeaderString() ?? '';
      const mesuresSérialisées = stringifier.stringifyRecords(mesuresMappées);

      const csv = `${BOM_CHAR}${entêteCsv}${mesuresSérialisées}`;

      reponse.attachment('mesures.csv').send(csv);
    })
  );

  return routeur;
};

export { ressourceMesureCsv };
