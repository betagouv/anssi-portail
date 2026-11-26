import cors from 'cors';
import { Router } from 'express';
import z from 'zod';
import { HttpStatusCode } from '@anssi-portail/axios';
import { QuestionnaireVraiFaux } from '@metier/mini-tests/vrai-faux/questionnaireVraiFaux.js';
import { ConfigurationServeur } from '../../configurationServeur.js';
import { filetRouteAsynchrone } from '../../middlewares/middleware.js';
import { valideCorpsRequete } from '../../zod.js';
import { schemaPostRéponsesVraiFaux } from './ressourceReponsesVraiFaux.schemas.js';

import CorpsDeRequeteTypee = Express.CorpsDeRequeteTypee;

export const ressourceRéponsesVraiFaux = ({
  busEvenements,
  entrepôtQuestionVraieFausse,
  entrepôtRésultatTestVraiFaux,
  middleware,
  entrepotUtilisateur,
  adaptateurHachage,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.options('/', cors());
  routeur.post(
    '/',
    cors(),
    valideCorpsRequete(schemaPostRéponsesVraiFaux),
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    filetRouteAsynchrone(async (requête: CorpsDeRequeteTypee<z.output<typeof schemaPostRéponsesVraiFaux>>, reponse) => {
      const toutesLesQuestions = await entrepôtQuestionVraieFausse.tous();

      const questionnaire = new QuestionnaireVraiFaux(toutesLesQuestions);
      await questionnaire.évalueRéponse({
        entrepôtRésultatTestVraiFaux,
        busÉvénements: busEvenements,
        idCorrélation: requête.body.idCorrélation,
        idQuestion: requête.body.idQuestion,
        réponseUtilisateur: requête.body.réponseUtilisateur,
        utilisateur: requête.utilisateur,
        score: requête.body.score,
      });

      return reponse.sendStatus(HttpStatusCode.Created);
    })
  );
  return routeur;
};
