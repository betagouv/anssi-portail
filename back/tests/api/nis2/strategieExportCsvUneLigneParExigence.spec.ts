import assert from 'node:assert';
import { describe, it } from 'node:test';
import { StrategieExportCsvUneLigneParExigence } from '../../../src/api/nis2/strategieExportCsvUneLigneParExigence';
import { ExigenceISO, ExigenceNIS2 } from '../../../src/metier/nis2/exigence';

describe('La stratégie d’export CSV avec une ligne par exigence', () => {
  describe('lorsqu’il n’a pas de référentiel comparé', () => {
    it('retourne les entêtes NIS2', () => {
      const strategieExport = new StrategieExportCsvUneLigneParExigence();

      const entetes = strategieExport.entetes([
        new ExigenceNIS2({
          reference: '',
          contenu: '',
          entitesCible: [],
          thematique: '',
          objectifSecurite: '',
        }),
      ]);

      assert.deepEqual(entetes, [
        { id: 'reference', title: 'Référence' },
        { id: 'contenu', title: 'Contenu' },
        { id: 'objectif', title: 'Objectif' },
        { id: 'thematique', title: 'Thématique' },
        { id: 'cibles', title: 'Cibles' },
      ]);
    });

    it('retourne les lignes des exigences NIS2', () => {
      const strategieExport = new StrategieExportCsvUneLigneParExigence();

      const lignes = strategieExport.lignes([
        new ExigenceNIS2({
          reference: 'ref',
          contenu: 'contenu',
          entitesCible: ['EntiteEssentielle'],
          thematique: 'thème',
          objectifSecurite: 'objectif',
        }),
      ]);

      assert.deepEqual(lignes, [
        {
          reference: 'ref',
          contenu: 'contenu',
          objectif: 'objectif',
          thematique: 'thème',
          cibles: 'EntiteEssentielle',
        },
      ]);
    });
  });

  describe('lorsque NIS2 est comparé à ISO', () => {
    it('retourne les entêtes avec la correspondance', () => {
      const strategieExport = new StrategieExportCsvUneLigneParExigence();
      const exigences = [exigenceNIS2AvecCorrespondances(0)];

      const entetes = strategieExport.entetes(exigences);

      assert.deepEqual(entetes, [
        { id: 'reference', title: 'Référence' },
        { id: 'contenu', title: 'Contenu' },
        { id: 'objectif', title: 'Objectif' },
        { id: 'thematique', title: 'Thématique' },
        { id: 'cibles', title: 'Cibles' },
        { id: 'correspondance', title: 'Correspondance' },
      ]);
    });

    it('adapte le nombre de colonnes au nombre d’exigences correspondantes maximum ', () => {
      const strategieExport = new StrategieExportCsvUneLigneParExigence();
      const exigences = [
        exigenceNIS2AvecCorrespondances(0),
        exigenceNIS2AvecCorrespondances(3),
      ];

      const entetes = strategieExport.entetes(exigences);

      assert.deepEqual(entetes.slice(6), [
        { id: 'reference_iso_1', title: 'Référence ISO (1)' },
        { id: 'contenu_iso_1', title: 'Contenu ISO (1)' },
        { id: 'reference_iso_2', title: 'Référence ISO (2)' },
        { id: 'contenu_iso_2', title: 'Contenu ISO (2)' },
        { id: 'reference_iso_3', title: 'Référence ISO (3)' },
        { id: 'contenu_iso_3', title: 'Contenu ISO (3)' },
      ]);
    });
  });
});

const exigenceNIS2AvecCorrespondances = (nombreCorrespondances: number) =>
  new ExigenceNIS2({
    reference: '',
    contenu: '',
    entitesCible: [],
    thematique: '',
    objectifSecurite: '',
    referentielCompare: 'ISO',
    correspondance: {
      exigences: new Array(nombreCorrespondances).map(exigenceISO),
      niveau: 'faible',
      observations: '',
    },
  });

const exigenceISO = () =>
  new ExigenceISO({
    reference: '',
    contenu: '',
    chapitre: '',
    norme: '',
    correspondance: { exigences: [], niveau: 'NA', observations: '' },
  });
