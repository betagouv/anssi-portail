import { HttpStatusCode } from '@anssi-portail/axios';
import { Router } from 'express';
import { corpsVide, valideCorpsRequete } from '../zod.js';

export const ressourceRappelMiseAJourAnnuaireContacts = () => {
  const routeur = Router();

  routeur.get('/', valideCorpsRequete(corpsVide), (_, réponse) => réponse.sendStatus(HttpStatusCode.Ok));

  return routeur;
};
