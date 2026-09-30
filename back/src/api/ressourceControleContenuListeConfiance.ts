import { Router } from 'express';
import { corpsVide, valideCorpsRequete } from './zod.js';

export const ressourceControleContenuListeConfiance = ({ version }: { version: 'v5' | 'v6' }) => {
  const routeur = Router();
  routeur.get('/', valideCorpsRequete(corpsVide), (_requete, reponse) => {
    const empreinte = {
      v5: '49daa29a23ab75a58009dce5e2cda4bdd1912e47b07015b2980023f26d581e8b',
      v6: '07578f8f158efcd070c67f47d198f54c94c79a268cbdde567287d7c9701bba16',
    };

    return reponse.send(Buffer.from(empreinte[version]));
  });
  return routeur;
};
