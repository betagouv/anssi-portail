import { loadWorkbook } from '@office-kit/xlsx/io';
import { fromBuffer } from '@office-kit/xlsx/node';
import { getSheetByIndex } from '@office-kit/xlsx/workbook';
import { describe, expect, it } from 'vitest';

import { ServiceModèleListeDesPrestatairesEtFournisseurs } from '@api/outils/modeleListePrestatairesEtFournisseurs/serviceModeleListePrestatairesEtFournisseurs.js';

import { fabriqueAdaptateurHorloge } from '../../infra/adaptateurHorlogePourLesTests.js';
import { fauxFournisseurDeChemin } from '../fauxObjets.js';

describe('Le service du modèle de liste des prestataires et des fournisseurs', () => {
  const fauxAdaptateurHorloge = fabriqueAdaptateurHorloge('2018-11-17');
  const récupèreModèleExcel = async () => {
    const service = new ServiceModèleListeDesPrestatairesEtFournisseurs(fauxFournisseurDeChemin, fauxAdaptateurHorloge);

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
