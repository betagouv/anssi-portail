import { loadWorkbook } from '@office-kit/xlsx/io';
import { fromBuffer } from '@office-kit/xlsx/node';
import { getSheetByIndex } from '@office-kit/xlsx/workbook';
import { describe, expect, it } from 'vitest';
import { ServiceModèleRevueComptesUtilisateurs } from '../../../src/api/outils/modeleRevueComptesUtilisateurs/serviceModeleRevueComptesUtilisateurs.js';
import { AdaptateurHorloge } from '../../../src/infra/adaptateurHorloge.js';
import { fauxFournisseurDeChemin } from '../fauxObjets.js';

describe('Le service du modèle de revue des comptes utilisateurs', () => {
  const fauxAdaptateurHorloge: AdaptateurHorloge = {
    maintenant: () => Temporal.PlainDate.from('2018-11-17').toZonedDateTime(Temporal.Now.timeZoneId()).toInstant(),
    maintenantZoné: () =>
      Temporal.PlainDate.from('2018-11-17')
        .toZonedDateTime(Temporal.Now.timeZoneId())
        .toInstant()
        .toZonedDateTimeISO(Temporal.Now.timeZoneId()),
  };
  const récupèreModèleExcel = async () => {
    const service = new ServiceModèleRevueComptesUtilisateurs(fauxFournisseurDeChemin, fauxAdaptateurHorloge);

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
