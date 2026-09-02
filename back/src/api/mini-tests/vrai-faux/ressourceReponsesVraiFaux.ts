import { HttpStatusCode } from '@anssi-portail/axios';
import { Router } from 'express';
import z from 'zod';
import { RéponsesVraieFausseSoumise } from '../../../bus/evenements/reponsesVraieFausseSoumise.js';
import { ConfigurationServeur } from '../../configurationServeur.js';
import { filetRouteAsynchrone } from '../../middlewares/middleware.js';
import { valideCorpsRequete } from '../../zod.js';
import { schemaPostRéponsesVraiFaux } from './ressourceReponsesVraiFaux.schemas.js';
import CorpsDeRequeteTypee = Express.CorpsDeRequeteTypee;
import { QuestionnaireVraiFauxTerminé } from '../../../bus/evenements/questionnaireVraiFauxTermine.js';

export const ressourceRéponsesVraiFaux = ({ busEvenements, entrepôtQuestionVraieFausse }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.post(
    '/',
    valideCorpsRequete(schemaPostRéponsesVraiFaux),
    filetRouteAsynchrone(async (requête: CorpsDeRequeteTypee<z.infer<typeof schemaPostRéponsesVraiFaux>>, reponse) => {
      const toutesLesQuestions = await entrepôtQuestionVraieFausse.tous();

      await busEvenements.publie(
        new RéponsesVraieFausseSoumise({
          idCorrélation: requête.body.idCorrélation,
          idQuestion: requête.body.idQuestion,
          réponseCorrecte: requête.body.réponseUtilisateur,
        })
      );

      if (requête.body.idQuestion === toutesLesQuestions.at(-1)?.idQuestion)
        await busEvenements.publie(
          new QuestionnaireVraiFauxTerminé({
            idCorrélation: requête.body.idCorrélation,
          })
        );

      return reponse.sendStatus(HttpStatusCode.Created);
    })
  );
  return routeur;
};
