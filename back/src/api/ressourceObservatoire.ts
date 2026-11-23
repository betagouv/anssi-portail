import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur.js';
import { filetRouteAsynchrone } from './middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from './zod.js';

const SANS_FILTRE = {};

export const ressourceObservatoire = ({ adaptateurObservatoire }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (_requete: Request, reponse: Response) => {
      const [total, cumulMensuel, parNiveauSecurite, mesuresFaitesParMois, cumulMensuelHomologations, dateExecution] =
        await Promise.all([
          adaptateurObservatoire.totalServices(SANS_FILTRE),
          adaptateurObservatoire.cumulMensuelServices(SANS_FILTRE),
          adaptateurObservatoire.servicesParNiveauSecurite(SANS_FILTRE),
          adaptateurObservatoire.mesuresFaitesParMois(SANS_FILTRE),
          adaptateurObservatoire.cumulMensuelHomologations(SANS_FILTRE),
          adaptateurObservatoire.dateDerniereExecution(),
        ]);

      reponse.send({
        dateDerniereMiseAJour: dateExecution?.toISOString() ?? null,
        services: { total, cumulMensuel, parNiveauSecurite },
        mesuresFaites: { parMois: mesuresFaitesParMois },
        homologations: { cumulMensuel: cumulMensuelHomologations },
      });
    })
  );
  return routeur;
};
