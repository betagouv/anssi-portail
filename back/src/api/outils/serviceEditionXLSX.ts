import { readFile } from 'node:fs/promises';
import { loadWorkbook } from '@office-kit/xlsx/io';
import { fromBuffer, workbookToBuffer } from '@office-kit/xlsx/node';
import { getSheetByIndex, Workbook } from '@office-kit/xlsx/workbook';
import { Worksheet } from '@office-kit/xlsx/worksheet';
import { AdaptateurHorloge } from '../../infra/adaptateurHorloge.js';
import { FournisseurChemin } from '../fournisseurChemin.js';

export class ServiceÉditionXLSX {
  constructor(private readonly adaptateurHorloge: AdaptateurHorloge) {}

  async chargeDocument(
    récupèreChemin: FournisseurChemin['back'][keyof FournisseurChemin['back']]
  ): Promise<ÉditeurDocumentXLSX> {
    const fichier = await readFile(récupèreChemin());

    const workbook = await loadWorkbook(fromBuffer(fichier));
    return new ÉditeurDocumentXLSX(this.adaptateurHorloge, workbook);
  }
}

export class ÉditeurDocumentXLSX {
  constructor(
    private readonly adaptateurHorloge: AdaptateurHorloge,
    private readonly document: Workbook
  ) {}

  chargeLaFeuilleÀLaPosition(indexDeLaFeuille: number): ÉditeurFeuilleXLSX {
    const feuille = getSheetByIndex(this.document, indexDeLaFeuille);

    if (!feuille) {
      throw new Error(`Impossible de récupérer la feuille ${indexDeLaFeuille} du modèle d'annuaire de crise`);
    }
    return new ÉditeurFeuilleXLSX(this.adaptateurHorloge, feuille);
  }

  versBuffer(): Promise<Buffer> {
    return workbookToBuffer(this.document);
  }
}

export class ÉditeurFeuilleXLSX {
  constructor(
    private readonly adaptateurHorloge: AdaptateurHorloge,
    private readonly feuille: Worksheet
  ) {}

  définisLibelléÀLaVersionDuJour() {
    const dateFormattée = this.adaptateurHorloge.maintenant().toLocaleDateString('fr-FR').replace(/\//g, '-');
    this.feuille.title = `Version du ${dateFormattée}`;
  }

  récupèreRéférence(): Worksheet {
    return this.feuille;
  }
}
