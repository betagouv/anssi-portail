import { readFile } from 'node:fs/promises';
import { loadWorkbook } from '@office-kit/xlsx/io';
import { fromBuffer } from '@office-kit/xlsx/node';
import { getSheetByIndex } from '@office-kit/xlsx/workbook';
import { describe, expect, it } from 'vitest';
import { ServiceModèleRACI } from '../../../src/api/outils/modeleRaci/serviceModeleRaci.js';
import { AdaptateurHorloge } from '../../../src/infra/adaptateurHorloge.js';
import { fauxFournisseurDeChemin } from '../fauxObjets.js';

describe('Le service du modèle de RACI', () => {
  const fauxAdaptateurHorloge: AdaptateurHorloge = {
    maintenant: () => new Date(2018, 10, 17),
  };
  const récupèreModèleExcel = async () => {
    const service = new ServiceModèleRACI(fauxFournisseurDeChemin, fauxAdaptateurHorloge);

    const wb = await loadWorkbook(fromBuffer(await service.génèreModèle()));
    const feuille = getSheetByIndex(wb, 0);
    if (!feuille) {
      throw Error('Feuille non définie !');
    }
    return feuille;
  };

  it('change le nom de la feuille', async () => {
    const feuille = await récupèreModèleExcel();

    expect(feuille.title).toBe('Version du 17-11-2018');
  });

  it('conserve le contenu et les propriétés des deux feuilles hormis le titre de la première', async () => {
    const original = await loadWorkbook(fromBuffer(await readFile(fauxFournisseurDeChemin.back.modèleRACI())));
    const service = new ServiceModèleRACI(fauxFournisseurDeChemin, fauxAdaptateurHorloge);
    const résultat = await loadWorkbook(fromBuffer(await service.génèreModèle()));
    const premièreFeuille = getSheetByIndex(original, 0)!;
    premièreFeuille.title = 'Version du 17-11-2018';

    expect(résultat.sheets).toEqual(original.sheets);
  });
});
