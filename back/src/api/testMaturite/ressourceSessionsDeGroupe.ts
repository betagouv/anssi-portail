import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';
import { SessionDeGroupe } from '../../metier/sessionDeGroupe';

export const ressourceSessionsDeGroupe = ({
  entrepotSessionDeGroupe,
  adaptateurEnvironnement,
  generateurCodeSessionDeGroupe,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.post('/', async (_: Request, reponse: Response) => {
    const sessionDeGroupe = await SessionDeGroupe.cree(
      generateurCodeSessionDeGroupe
    );
    await entrepotSessionDeGroupe.ajoute(sessionDeGroupe);
    reponse.status(201).send({
      code: sessionDeGroupe.code,
      lienParticipant: `${adaptateurEnvironnement.urlBaseMSC()}/test-maturite?session-groupe=${sessionDeGroupe.code}`,
    });
  });
  return routeur;
};
