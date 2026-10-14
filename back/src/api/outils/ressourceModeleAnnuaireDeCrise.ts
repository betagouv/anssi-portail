import { readFile } from 'fs/promises';
import { loadWorkbook } from '@office-kit/xlsx/io';
import { fromBuffer, workbookToBuffer } from '@office-kit/xlsx/node';
import { getSheetByIndex } from '@office-kit/xlsx/workbook';
import { Request, Response, Router } from 'express';
import { OutilTéléchargé } from '../../bus/evenements/outilTelecharge.js';
import { Utilisateur } from '../../metier/utilisateur.js';
import { ConfigurationServeur } from '../configurationServeur.js';
import { filetRouteAsynchrone } from '../middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from '../zod.js';

export const ressourceModeleAnnuaireDeCrise = ({
  adaptateurHachage,
  busEvenements,
  entrepotUtilisateur,
  fournisseurChemin,
  middleware,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/',
    middleware.verifieJWT,
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (requête: Request, réponse: Response) => {
      const utilisateur = requête.utilisateur as Utilisateur;

      const fichier = await readFile(fournisseurChemin.back.modèleAnnuaireDeCrise());

      const wb = await loadWorkbook(fromBuffer(fichier));
      const feuille = getSheetByIndex(wb, 0);
      if (feuille) {
        const dateFormattée = new Date().toLocaleDateString('fr-FR').replace(/\//g, '-');
        feuille.title = `Version du ${dateFormattée}`;
      }
      const contenuBinaire = await workbookToBuffer(wb);

      réponse
        .type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        .attachment('modele-annuaire-de-crise.xlsx')
        .send(contenuBinaire);

      await busEvenements.publie(new OutilTéléchargé(utilisateur.email, 'Modèle_annuaire_crise'));
    })
  );
  return routeur;
};
