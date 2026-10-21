import { readFile } from 'node:fs/promises';
import { loadWorkbook } from '@office-kit/xlsx/io';
import { fromBuffer, workbookToBuffer } from '@office-kit/xlsx/node';
import { getSheetByIndex, Workbook } from '@office-kit/xlsx/workbook';
import { Worksheet } from '@office-kit/xlsx/worksheet';
import { FournisseurChemin } from '../fournisseurChemin.js';

export class ServiceÉditionXLSX {
  async chargeDocument(
    récupèreChemin: FournisseurChemin['back'][keyof FournisseurChemin['back']]
  ): Promise<ÉditeurDocumentXLSX> {
    const fichier = await readFile(récupèreChemin());

    const workbook = await loadWorkbook(fromBuffer(fichier));
    return new ÉditeurDocumentXLSX(workbook);
  }
}

export class ÉditeurDocumentXLSX {
  constructor(private readonly document: Workbook) {}

  chargeLaFeuilleÀLaPosition(indexDeLaFeuille: number): ÉditeurFeuilleXLSX {
    const feuille = getSheetByIndex(this.document, indexDeLaFeuille);

    if (!feuille) {
      throw new Error(`Impossible de récupérer la feuille ${indexDeLaFeuille} du modèle d'annuaire de crise`);
    }
    return new ÉditeurFeuilleXLSX(feuille);
  }

  versBuffer(): Promise<Buffer> {
    return workbookToBuffer(this.document);
  }
}

export class ÉditeurFeuilleXLSX {
  constructor(private readonly feuille: Worksheet) {}

  définisLibelléÀLaVersionDuJour() {
    const dateFormattée = new Date().toLocaleDateString('fr-FR').replace(/\//g, '-');
    this.feuille.title = `Version du ${dateFormattée}`;
  }

  récupèreRéférence(): Worksheet {
    return this.feuille;
  }
}
