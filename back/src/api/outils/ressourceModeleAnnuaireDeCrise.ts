import { readFile } from 'fs/promises';
import { Cell, getCoordinate } from '@office-kit/xlsx/cell';
import { loadWorkbook } from '@office-kit/xlsx/io';
import { fromBuffer, workbookToBuffer } from '@office-kit/xlsx/node';
import { getSheetByIndex } from '@office-kit/xlsx/workbook';
import { getCellsInRow, setHyperlinks, Worksheet } from '@office-kit/xlsx/worksheet';
import { Request, Response, Router } from 'express';
import { OutilTéléchargé } from '../../bus/evenements/outilTelecharge.js';
import { EntrepôtContact } from '../../metier/contacts/entrepotContact.js';
import { Utilisateur } from '../../metier/utilisateur.js';
import { ConfigurationServeur } from '../configurationServeur.js';
import { filetRouteAsynchrone } from '../middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from '../zod.js';

export const ressourceModeleAnnuaireDeCrise = ({
  adaptateurHachage,
  busEvenements,
  entrepotUtilisateur,
  entrepôtContact,
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

      if (!feuille) {
        throw new Error("Impossible de récupérer la première feuille du modèle d'annuaire de crise");
      }
      changeLeTitreDeLaFeuille(feuille);

      await complèteContactsNationaux(entrepôtContact, feuille);

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
function changeLeTitreDeLaFeuille(feuille: Worksheet) {
  const dateFormattée = new Date().toLocaleDateString('fr-FR').replace(/\//g, '-');
  feuille.title = `Version du ${dateFormattée}`;
}

async function complèteContactsNationaux(entrepôtContact: EntrepôtContact, feuille: Worksheet) {
  const LIGNE_PREMIER_CONTACT_NATIONAL = 70;
  const contacts = await entrepôtContact.nationaux();
  for (let i = 0; i < 2; i++) {
    const [_entête, nom, fonction, _téléphone, _email, _emailDeSecours, _status, donnéesComplémentaire] = getCellsInRow(
      feuille,
      LIGNE_PREMIER_CONTACT_NATIONAL + i
    );
    nom.value = contacts[i].nom;
    fonction.value = 'ANSSI';
    ajouteUnLien(
      feuille,
      donnéesComplémentaire,
      `${contacts[i].lienPrincipal.libelle} - ${contacts[i].lienPrincipal.href}`,
      contacts[i].lienPrincipal.href
    );
  }
}

function ajouteUnLien(feuille: Worksheet, cellule: Cell, libelle: string, href: string) {
  cellule.value = libelle;
  setHyperlinks(feuille, [
    {
      ref: getCoordinate(cellule),
      target: href,
    },
  ]);
}
