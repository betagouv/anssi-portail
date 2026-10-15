import { getCoordinate } from '@office-kit/xlsx/cell';
import { loadWorkbook } from '@office-kit/xlsx/io';
import { fromBuffer } from '@office-kit/xlsx/node';
import { getSheetByIndex } from '@office-kit/xlsx/workbook';
import { getCellsInRow } from '@office-kit/xlsx/worksheet';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ServiceModeleAnnuaireDeCrise } from '../../../src/api/outils/serviceModeleAnnuaireDeCrise.js';
import { EntrepôtContactStatique } from '../../../src/infra/entrepotContactStatique.js';
import { fauxFournisseurDeChemin } from '../fauxObjets.js';

describe("Le service du modèle de l'annuaire de crise", () => {
  const récupèreModèleExcel = async () => {
    const service = new ServiceModeleAnnuaireDeCrise(fauxFournisseurDeChemin, new EntrepôtContactStatique());

    const wb = await loadWorkbook(fromBuffer(await service.génèreModèle()));
    const feuille = getSheetByIndex(wb, 0);
    if (!feuille) {
      throw Error('Feuille non définie !');
    }
    return feuille;
  };

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2018-11-17T10:11:12Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('change le nom de la feuille', async () => {
    const feuille = await récupèreModèleExcel();

    expect(feuille.title).toBe('Version du 17-11-2018');
  });

  it('ajoute les contacts nationaux', async () => {
    const premièreligneDesContactsNationnaux = 70;
    const deuxièmeLigneDesContactsNationaux = 71;

    const feuille = await récupèreModèleExcel();

    const [
      _entêteCERT,
      nomCERT,
      fonctionCERT,
      téléphoneCERT,
      emailCERT,
      emailDeSecoursCERT,
      _statusCERT,
      donnéesComplémentaireCERT,
    ] = getCellsInRow(feuille, premièreligneDesContactsNationnaux);

    const [
      _entêteCyber17,
      nomCyber17,
      fonctionCyber17,
      téléphoneCyber17,
      emailCyber17,
      emailDeSecoursCyber17,
      _statusCyber17,
      donnéesComplémentaireCyber17,
    ] = getCellsInRow(feuille, deuxièmeLigneDesContactsNationaux);

    expect(nomCERT.value).toBe('CERT-FR');
    expect(fonctionCERT.value).toBe('ANSSI');
    expect(téléphoneCERT.value).toBeNull();
    expect(emailCERT.value).toBeNull();
    expect(emailDeSecoursCERT.value).toBeNull();
    expect(donnéesComplémentaireCERT.value).toBe(
      'Toutes les coordonnées du CERT-FR - https://www.cert.ssi.gouv.fr/contact/'
    );

    expect(nomCyber17.value).toBe('17 Cyber');
    expect(fonctionCyber17.value).toBe('ANSSI');
    expect(téléphoneCyber17.value).toBeNull();
    expect(emailCyber17.value).toBeNull();
    expect(emailDeSecoursCyber17.value).toBeNull();
    expect(donnéesComplémentaireCyber17.value).toBe(
      'Aller sur le 17Cyber - https://www.cybermalveillance.gouv.fr/diagnostic'
    );

    expect(feuille.hyperlinks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ref: getCoordinate(donnéesComplémentaireCERT),
          target: 'https://www.cert.ssi.gouv.fr/contact/',
        }),
        expect.objectContaining({
          ref: getCoordinate(donnéesComplémentaireCyber17),
          target: 'https://www.cybermalveillance.gouv.fr/diagnostic',
        }),
      ])
    );
  });
});
