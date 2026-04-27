import { Request, Response, Router } from 'express';
import { SessionDeGroupe } from '../../metier/sessionDeGroupe';
import { ConfigurationServeur } from '../configurationServeur';
import { filetRouteAsynchrone } from '../middleware';
import { corpsVide, valideCorpsRequete } from '../zod';

export const ressourceSessionsDeGroupe = ({
  entrepotSessionDeGroupe,
  adaptateurEnvironnement,
  generateurCodeSessionDeGroupe,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.post(
    '/',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (_: Request, reponse: Response) => {
      const sessionDeGroupe = await SessionDeGroupe.cree(generateurCodeSessionDeGroupe);
      await entrepotSessionDeGroupe.ajoute(sessionDeGroupe);
      reponse.status(201).send({
        code: sessionDeGroupe.code,
        lienParticipant: `${adaptateurEnvironnement.urlBaseMSC()}/test-maturite?session-groupe=${sessionDeGroupe.code}`,
      });
    })
  );
  return routeur;
};
