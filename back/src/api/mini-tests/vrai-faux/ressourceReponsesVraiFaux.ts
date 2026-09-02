import { HttpStatusCode } from '@anssi-portail/axios';
import { Router } from 'express';
import z from 'zod';
import { QuestionnaireVraiFaux } from '../../../metier/mini-tests/vrai-faux/questionnaireVraiFaux.js';
import { ConfigurationServeur } from '../../configurationServeur.js';
import { filetRouteAsynchrone } from '../../middlewares/middleware.js';
import { valideCorpsRequete } from '../../zod.js';
import { schemaPostRéponsesVraiFaux } from './ressourceReponsesVraiFaux.schemas.js';
import CorpsDeRequeteTypee = Express.CorpsDeRequeteTypee;

export const ressourceRéponsesVraiFaux = ({ busEvenements, entrepôtQuestionVraieFausse }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.post(
    '/',
    valideCorpsRequete(schemaPostRéponsesVraiFaux),
    filetRouteAsynchrone(async (requête: CorpsDeRequeteTypee<z.infer<typeof schemaPostRéponsesVraiFaux>>, reponse) => {
      const toutesLesQuestions = await entrepôtQuestionVraieFausse.tous();

      const questionnaire = new QuestionnaireVraiFaux(toutesLesQuestions);
      await questionnaire.évalueRéponse({
        busÉvénements: busEvenements,
        idCorrélation: requête.body.idCorrélation,
        idQuestion: requête.body.idQuestion,
        réponseUtilisateur: requête.body.réponseUtilisateur,
      });

      return reponse.sendStatus(HttpStatusCode.Created);
    })
  );
  return routeur;
};
