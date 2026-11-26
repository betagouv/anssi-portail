import { readFile } from 'node:fs/promises';
import { loadWorkbook } from '@office-kit/xlsx/io';
import { fromBuffer } from '@office-kit/xlsx/node';
import { getSheetByIndex } from '@office-kit/xlsx/workbook';
import { describe, expect, it, vi } from 'vitest';

import { ServiceModèleRACI } from '@api/outils/modeleRaci/serviceModeleRaci.js';

import { fabriqueAdaptateurHorloge } from '../../infra/adaptateurHorlogePourLesTests.js';
import { fauxFournisseurDeChemin } from '../fauxObjets.js';

describe('Le service du modèle de RACI', () => {
  const fauxAdaptateurHorloge = fabriqueAdaptateurHorloge('2018-11-17');
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

  it.each([
    ['Europe/Paris', '02-01-2026'],
    ['America/Los_Angeles', '01-01-2026'],
  ])('date la version dans le fuseau du serveur (%s)', async (fuseau, dateAttendue) => {
    vi.spyOn(Temporal.Now, 'timeZoneId').mockReturnValue(fuseau);
    const service = new ServiceModèleRACI(fauxFournisseurDeChemin, fabriqueAdaptateurHorloge('2026-01-01T23:30:00Z'));

    const résultat = await loadWorkbook(fromBuffer(await service.génèreModèle()));

    expect(getSheetByIndex(résultat, 0)?.title).toBe(`Version du ${dateAttendue}`);
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
