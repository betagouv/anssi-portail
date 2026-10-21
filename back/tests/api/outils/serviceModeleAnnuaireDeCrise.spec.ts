import { getCoordinate } from '@office-kit/xlsx/cell';
import { loadWorkbook } from '@office-kit/xlsx/io';
import { fromBuffer } from '@office-kit/xlsx/node';
import { getSheetByIndex } from '@office-kit/xlsx/workbook';
import { getCellsInRow } from '@office-kit/xlsx/worksheet';
import { describe, expect, it } from 'vitest';
import { ServiceModeleAnnuaireDeCrise } from '../../../src/api/outils/modeleAnnuaireDeCrise/serviceModeleAnnuaireDeCrise.js';
import { AdaptateurHorloge } from '../../../src/infra/adaptateurHorloge.js';
import { EntrepôtContactStatique } from '../../../src/infra/entrepotContactStatique.js';
import { CodeRégion } from '../../../src/metier/referentielRegions.js';
import { fauxFournisseurDeChemin } from '../fauxObjets.js';

describe("Le service du modèle de l'annuaire de crise", () => {
  const fauxAdaptateurHorloge: AdaptateurHorloge = {
    maintenant: () => new Date(2018, 10, 17),
  };
  const récupèreModèleExcel = async ({
    codeActivité,
    codeRégion,
  }: { codeActivité?: string; codeRégion?: CodeRégion } = {}) => {
    const service = new ServiceModeleAnnuaireDeCrise(
      fauxFournisseurDeChemin,
      new EntrepôtContactStatique(),
      fauxAdaptateurHorloge
    );

    const wb = await loadWorkbook(fromBuffer(await service.génèreModèle({ codeActivité, codeRégion })));
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

  describe('gère les contacts nationaux', () => {
    it('en les ajoutant dans les bonnes lignes', async () => {
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
      expect(téléphoneCERT.value).toBe('3218 ou 09 70 83 32 18');
      expect(emailCERT.value).toBe('cert-fr@ssi.gouv.fr');
      expect(emailDeSecoursCERT.value).toBeNull();
      expect(donnéesComplémentaireCERT.value).toBe(
        'Toutes les coordonnées du CERT-FR - https://www.cert.ssi.gouv.fr/contact/'
      );

      expect(nomCyber17.value).toBe('17 Cyber');
      expect(fonctionCyber17.value).toBe('Police nationale, la Gendarmerie et Cybermalveillance.gouv.fr');
      expect(téléphoneCyber17.value).toBe('17 (France) ou 112 (Europe)');
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

  describe('gère les contacts sectoriels', () => {
    it("en les ajoutant dans les bonnes lignes lorsqu'ils existent", async () => {
      const LigneDeContactSectoriel = 66;
      const codeActivité = '84.22Z';

      const feuille = await récupèreModèleExcel({ codeActivité });

      const [_entête, nom, fonction, téléphone, email, emailDeSecours, _status, donnéesComplémentaire] = getCellsInRow(
        feuille,
        LigneDeContactSectoriel
      );

      expect(nom.value).toBe('CERT Entreprise Défense (CERT ED)');
      expect(fonction.value).toBeNull();
      expect(téléphone.value).toBeNull();
      expect(email.value).toBeNull();
      expect(emailDeSecours.value).toBeNull();
      expect(donnéesComplémentaire.value).toBe(
        'https://www.defense.gouv.fr/drsd/ressources-entreprises/cert-entreprises-defense'
      );

      expect(feuille.hyperlinks).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ref: getCoordinate(donnéesComplémentaire),
            target: 'https://www.defense.gouv.fr/drsd/ressources-entreprises/cert-entreprises-defense',
          }),
        ])
      );
    });

    it("en ne modfiant rien lorsqu'ils n'existent pas", async () => {
      const LigneDeContactSectoriel = 66;
      const codeActivité = '01.00B';

      const feuille = await récupèreModèleExcel({ codeActivité });

      const [_entête, nom, fonction, téléphone, email, emailDeSecours, _status, donnéesComplémentaire] = getCellsInRow(
        feuille,
        LigneDeContactSectoriel
      );

      expect(nom.value).toBeNull();
      expect(fonction.value).toBeNull();
      expect(téléphone.value).toBeNull();
      expect(email.value).toBeNull();
      expect(emailDeSecours.value).toBeNull();
      expect(donnéesComplémentaire.value).toBeNull();

      expect(feuille.hyperlinks).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ref: getCoordinate(donnéesComplémentaire),
            target: 'https://www.defense.gouv.fr/drsd/ressources-entreprises/cert-entreprises-defense',
          }),
        ])
      );
    });
  });

  describe('gère les contacts régionaux', () => {
    it("en les ajoutant dans les bonnes lignes lorsqu'ils existent", async () => {
      const LigneDeContactRégionaux = 62;
      const codeRégion: CodeRégion = 'FR-BRE';

      const feuille = await récupèreModèleExcel({ codeRégion });

      const [
        _entêteCOT,
        nomCOT,
        fonctionCOT,
        téléphoneCOT,
        emailCOT,
        emailDeSecoursCOT,
        _statusCOT,
        donnéesComplémentaireCOT,
      ] = getCellsInRow(feuille, LigneDeContactRégionaux);

      expect(nomCOT.value).toBe('Jérôme LAINE');
      expect(fonctionCOT.value).toBeNull();
      expect(téléphoneCOT.value).toBeNull();
      expect(emailCOT.value).toBe('bretagne@ssi.gouv.fr');
      expect(emailDeSecoursCOT.value).toBeNull();
      expect(donnéesComplémentaireCOT.value).toBeNull();

      const [
        _entêteCSIRT,
        nomCSIRT,
        fonctionCSIRT,
        téléphoneCSIRT,
        emailCSIRT,
        emailDeSecoursCSIRT,
        _statusCSIRT,
        donnéesComplémentaireCSIRT,
      ] = getCellsInRow(feuille, LigneDeContactRégionaux + 1);

      expect(nomCSIRT.value).toBe('Breizh Cyber');
      expect(fonctionCSIRT.value).toBeNull();
      expect(téléphoneCSIRT.value).toBe('0 800 200 008');
      expect(emailCSIRT.value).toBeNull();
      expect(emailDeSecoursCSIRT.value).toBeNull();
      expect(donnéesComplémentaireCSIRT.value).toBe('site web - https://breizhcyber.bzh/');

      expect(feuille.hyperlinks).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ref: getCoordinate(donnéesComplémentaireCSIRT),
            target: 'https://breizhcyber.bzh/',
          }),
        ])
      );

      const [
        _entêteCampus,
        nomCampus,
        fonctionCampus,
        téléphoneCampus,
        emailCampus,
        emailDeSecoursCampus,
        _statusCampus,
        donnéesComplémentaireCampus,
      ] = getCellsInRow(feuille, LigneDeContactRégionaux + 2);

      expect(nomCampus.value).toBe('Bretagne Cyber Alliance');
      expect(fonctionCampus.value).toBeNull();
      expect(téléphoneCampus.value).toBeNull();
      expect(emailCampus.value).toBe('contact@cyberalliance.bzh');
      expect(emailDeSecoursCampus.value).toBeNull();
      expect(donnéesComplémentaireCampus.value).toBe('site web - https://www.cyberalliance.bzh/');

      expect(feuille.hyperlinks).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ref: getCoordinate(donnéesComplémentaireCampus),
            target: 'https://www.cyberalliance.bzh/',
          }),
        ])
      );
    });
  });
});
