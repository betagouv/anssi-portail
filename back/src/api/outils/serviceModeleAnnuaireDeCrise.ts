import { readFile } from 'node:fs/promises';
import { calculeCodeSecteurContact } from '@anssi-portail/contacts-sectoriels';
import { Cell, getCoordinate } from '@office-kit/xlsx/cell';
import { loadWorkbook } from '@office-kit/xlsx/io';
import { fromBuffer, workbookToBuffer } from '@office-kit/xlsx/node';
import { getSheetByIndex } from '@office-kit/xlsx/workbook';
import { getCellsInRow, setHyperlinks, Worksheet } from '@office-kit/xlsx/worksheet';
import { EntrepôtContact } from '../../metier/contacts/entrepotContact.js';
import { FournisseurChemin } from '../fournisseurChemin.js';

const LIGNE_PREMIER_CONTACT_NATIONAL = 70;
const LIGNE_CONTACT_SECTORIEL = 66;

const changeLeTitreDeLaFeuille = (feuille: Worksheet): void => {
  const dateFormattée = new Date().toLocaleDateString('fr-FR').replace(/\//g, '-');
  feuille.title = `Version du ${dateFormattée}`;
};

const ajouteUnLien = (feuille: Worksheet, cellule: Cell, libelle: string, href: string): void => {
  cellule.value = libelle;
  setHyperlinks(feuille, [
    {
      ref: getCoordinate(cellule),
      target: href,
    },
  ]);
};

export class ServiceModeleAnnuaireDeCrise {
  constructor(
    private readonly fournisseurChemin: FournisseurChemin,
    private readonly entrepôtContact: EntrepôtContact
  ) {}

  async génèreModèle({ codeActivité }: { codeActivité?: string } = {}): Promise<Buffer> {
    const fichier = await readFile(this.fournisseurChemin.back.modèleAnnuaireDeCrise());

    const wb = await loadWorkbook(fromBuffer(fichier));
    const feuille = getSheetByIndex(wb, 0);

    if (!feuille) {
      throw new Error("Impossible de récupérer la première feuille du modèle d'annuaire de crise");
    }
    changeLeTitreDeLaFeuille(feuille);

    await this.complèteContactsNationaux(feuille);
    await this.complèteContactSectoriel(feuille, codeActivité);

    return await workbookToBuffer(wb);
  }

  private async complèteContactsNationaux(feuille: Worksheet): Promise<void> {
    const contacts = await this.entrepôtContact.nationaux();
    for (let i = 0; i < 2; i++) {
      const [_entête, nom, fonction, _téléphone, _email, _emailDeSecours, _status, donnéesComplémentaire] =
        getCellsInRow(feuille, LIGNE_PREMIER_CONTACT_NATIONAL + i);
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

  private async complèteContactSectoriel(feuille: Worksheet, codeActivité?: string): Promise<void> {
    if (!codeActivité) return;
    const codeSecteurContact = calculeCodeSecteurContact(codeActivité);
    if (!codeSecteurContact) return;

    const contact = (await this.entrepôtContact.sectoriels())[codeSecteurContact];

    const [_entête, nom, _fonction, _téléphone, _email, _emailDeSecours, _status, donnéesComplémentaire] =
      getCellsInRow(feuille, LIGNE_CONTACT_SECTORIEL);
    nom.value = contact.nom;
    ajouteUnLien(feuille, donnéesComplémentaire, `${contact.siteWeb}`, contact.siteWeb);
  }
}
