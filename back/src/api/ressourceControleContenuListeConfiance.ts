import { Router } from 'express';
import { corpsVide, valideCorpsRequete } from './zod';

export const ressourceControleContenuListeConfiance = () => {
  const routeur = Router();
  routeur.get('/', valideCorpsRequete(corpsVide), (_requete, reponse) => {
    reponse.send(Buffer.from('49daa29a23ab75a58009dce5e2cda4bdd1912e47b07015b2980023f26d581e8b'));
  });
  return routeur;
};
