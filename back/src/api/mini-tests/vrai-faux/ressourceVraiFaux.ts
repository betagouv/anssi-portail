import { HttpStatusCode } from '@anssi-portail/axios';
import { Router } from 'express';
import { filetRouteAsynchrone } from '../../middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from '../../zod.js';
import { ConfigurationServeur } from '../../configurationServeur.js';

export const ressourceVraiFaux = ({ entrepôtQuestionVraieFausse }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (_requete, reponse) => {
      const toutesLesQuestions = await entrepôtQuestionVraieFausse.tous();
      reponse.status(HttpStatusCode.Ok).send(toutesLesQuestions);
    })
  );
  return routeur;
};
