import { HttpStatusCode } from '@anssi-portail/axios';
import { Response } from 'express';
import { FournisseurChemin } from './fournisseurChemin.js';

export class ErreurTraverséeDeChemin extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PathTraversalError';
  }
}

export const erreurPageNonTrouvée = (reponse: Response, fournisseurChemin: FournisseurChemin) =>
  reponse
    .status(HttpStatusCode.NotFound)
    .set('Content-Type', 'text/html')
    .envoieFichierEnrichi(fournisseurChemin.jekyll.page404());

export const erreurPageInterdite = (reponse: Response) =>
  reponse.status(HttpStatusCode.Forbidden).json({ erreur: 'Accès refusé' });
