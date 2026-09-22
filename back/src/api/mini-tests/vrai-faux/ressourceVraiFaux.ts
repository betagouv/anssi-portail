import { HttpStatusCode } from '@anssi-portail/axios';
import cors from 'cors';
import { Router } from 'express';
import { ConfigurationServeur } from '../../configurationServeur.js';
import { filetRouteAsynchrone } from '../../middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from '../../zod.js';

export const ressourceVraiFaux = ({ entrepôtQuestionVraieFausse }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/',
    cors(),
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (_requete, reponse) => {
      const toutesLesQuestions = await entrepôtQuestionVraieFausse.tous();
      reponse.status(HttpStatusCode.Ok).send(toutesLesQuestions);
    })
  );
  return routeur;
};
