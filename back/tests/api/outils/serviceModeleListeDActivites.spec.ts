import { loadWorkbook } from '@office-kit/xlsx/io';
import { fromBuffer } from '@office-kit/xlsx/node';
import { getSheetByIndex } from '@office-kit/xlsx/workbook';
import { describe, expect, it } from 'vitest';
import { ServiceModèleListeDActivités } from '../../../src/api/outils/serviceModeleListeDActivites.js';
import { AdaptateurHorloge } from '../../../src/infra/adaptateurHorloge.js';
import { fauxFournisseurDeChemin } from '../fauxObjets.js';

describe("Le service du modèle de liste d'activités", () => {
  const fauxAdaptateurHorloge: AdaptateurHorloge = {
    maintenant: () => new Date(2018, 10, 17),
  };
  const récupèreModèleExcel = async () => {
    const service = new ServiceModèleListeDActivités(fauxFournisseurDeChemin, fauxAdaptateurHorloge);

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
});
