import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { StrategieExportCsvUneLigneParExigence } from '../../../src/api/nis2/strategieExportCsvUneLigneParExigence';
import {
  Exigence,
  ExigenceAE,
  ExigenceISO,
  ExigenceNIS2,
  Referentiel,
} from '../../../src/metier/nis2/exigence';

describe('La stratégie d’export CSV avec une ligne par exigence', () => {
  let strategieExport: StrategieExportCsvUneLigneParExigence;
  beforeEach(() => {
    strategieExport = new StrategieExportCsvUneLigneParExigence();
  });

  it('reste robuste lorsqu’il n’y a pas d’exigence', () => {
    const entetes = strategieExport.entetes([]);

    assert.deepEqual(entetes, []);
  });

  describe('lorsqu’il n’a pas de référentiel comparé', () => {
    it('retourne les entêtes NIS2', () => {
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
      const exigences = [exigenceNIS2AvecCorrespondancesISO(0)];

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
      const exigences = [
        exigenceNIS2AvecCorrespondancesISO(0),
        exigenceNIS2AvecCorrespondancesISO(3),
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

    it('retourne les lignes des exigences NIS2 avec les correspondances', () => {
      const exigences = [
        new ExigenceNIS2({
          reference: '',
          contenu: '',
          entitesCible: [],
          thematique: '',
          objectifSecurite: '',
          referentielCompare: 'ISO',
          correspondance: {
            exigences: [
              exigenceISO('refiso1', 'contenuiso1'),
              exigenceISO('refiso2', 'contenuiso2'),
            ],
            niveau: 'faible',
            observations: '',
          },
        }),
      ];

      const lignes = strategieExport.lignes(exigences);

      assert.deepEqual(lignes, [
        {
          reference: '',
          contenu: '',
          objectif: '',
          thematique: '',
          cibles: '',
          correspondance: 'faible',
          reference_iso_1: 'refiso1',
          contenu_iso_1: 'contenuiso1',
          reference_iso_2: 'refiso2',
          contenu_iso_2: 'contenuiso2',
        },
      ]);
    });
  });

  describe('lorsque NIS2 est comparé à AE', () => {
    it('retourne les entêtes avec la correspondance', () => {
      const exigences = [exigenceNIS2AvecCorrespondancesAE(0)];

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
      const exigences = [
        exigenceNIS2AvecCorrespondancesAE(0),
        exigenceNIS2AvecCorrespondancesAE(3),
      ];

      const entetes = strategieExport.entetes(exigences);

      assert.deepEqual(entetes.slice(6), [
        {
          id: 'reference_ae_1',
          title: 'Référence Annexe au Règlement d’exécution 2024/2690 (1)',
        },
        {
          id: 'contenu_ae_1',
          title: 'Contenu Annexe au Règlement d’exécution 2024/2690 (1)',
        },
        {
          id: 'reference_ae_2',
          title: 'Référence Annexe au Règlement d’exécution 2024/2690 (2)',
        },
        {
          id: 'contenu_ae_2',
          title: 'Contenu Annexe au Règlement d’exécution 2024/2690 (2)',
        },
        {
          id: 'reference_ae_3',
          title: 'Référence Annexe au Règlement d’exécution 2024/2690 (3)',
        },
        {
          id: 'contenu_ae_3',
          title: 'Contenu Annexe au Règlement d’exécution 2024/2690 (3)',
        },
      ]);
    });

    it('retourne les lignes des exigences NIS2 avec les correspondances', () => {
      const exigences = [
        new ExigenceNIS2({
          reference: '',
          contenu: '',
          entitesCible: [],
          thematique: '',
          objectifSecurite: '',
          referentielCompare: 'AE',
          correspondance: {
            exigences: [
              exigenceAE('refae1', 'contenuae1'),
              exigenceAE('refae2', 'contenuae2'),
            ],
            niveau: 'faible',
            observations: '',
          },
        }),
      ];

      const lignes = strategieExport.lignes(exigences);

      assert.deepEqual(lignes, [
        {
          reference: '',
          contenu: '',
          objectif: '',
          thematique: '',
          cibles: '',
          correspondance: 'faible',
          reference_ae_1: 'refae1',
          contenu_ae_1: 'contenuae1',
          reference_ae_2: 'refae2',
          contenu_ae_2: 'contenuae2',
        },
      ]);
    });
  });

  describe('lorsque AE est comparé à NIS 2', () => {
    it('retourne les entêtes avec la correspondance', () => {
      const exigences = [exigenceAEAvecCorrespondancesNIS2(0)];

      const entetes = strategieExport.entetes(exigences);

      assert.deepEqual(entetes, [
        { id: 'reference', title: 'Référence' },
        { id: 'contenu', title: 'Contenu' },
        { id: 'correspondance', title: 'Correspondance' },
      ]);
    });

    it('adapte le nombre de colonnes au nombre d’exigences correspondantes maximum ', () => {
      const exigences = [
        exigenceAEAvecCorrespondancesNIS2(0),
        exigenceAEAvecCorrespondancesNIS2(3),
      ];

      const entetes = strategieExport.entetes(exigences);

      assert.deepEqual(entetes.slice(3), [
        {
          id: 'reference_nis2_1',
          title: 'Référence exigence applicable à NIS 2 (1)',
        },
        {
          id: 'contenu_nis2_1',
          title: 'Contenu exigence applicable à NIS 2 (1)',
        },
        {
          id: 'reference_nis2_2',
          title: 'Référence exigence applicable à NIS 2 (2)',
        },
        {
          id: 'contenu_nis2_2',
          title: 'Contenu exigence applicable à NIS 2 (2)',
        },
        {
          id: 'reference_nis2_3',
          title: 'Référence exigence applicable à NIS 2 (3)',
        },
        {
          id: 'contenu_nis2_3',
          title: 'Contenu exigence applicable à NIS 2 (3)',
        },
      ]);
    });

    it('retourne les lignes des exigences AE avec les correspondances', () => {
      const exigences = [
        new ExigenceAE({
          reference: '',
          contenu: '',
          correspondance: {
            exigences: [
              exigenceNIS2SansCorrespondance('refnis2-1', 'contenunis2-1'),
              exigenceNIS2SansCorrespondance('refnis2-2', 'contenunis2-2'),
            ],
            niveau: 'faible',
            observations: '',
          },
        }),
      ];

      const lignes = strategieExport.lignes(exigences);

      assert.deepEqual(lignes, [
        {
          reference: '',
          contenu: '',
          correspondance: 'faible',
          reference_nis2_1: 'refnis2-1',
          contenu_nis2_1: 'contenunis2-1',
          reference_nis2_2: 'refnis2-2',
          contenu_nis2_2: 'contenunis2-2',
        },
      ]);
    });
  });

  describe('lorsque ISO est comparé à NIS 2', () => {
    it('retourne les entêtes avec la correspondance', () => {
      const exigences = [exigenceISOAvecCorrespondancesNIS2(0)];

      const entetes = strategieExport.entetes(exigences);

      assert.deepEqual(entetes, [
        { id: 'reference', title: 'Référence' },
        { id: 'contenu', title: 'Contenu' },
        { id: 'norme', title: 'Norme' },
        { id: 'chapitre', title: 'Chapitre' },
        { id: 'correspondance', title: 'Correspondance' },
      ]);
    });

    it('adapte le nombre de colonnes au nombre d’exigences correspondantes maximum ', () => {
      const exigences = [
        exigenceISOAvecCorrespondancesNIS2(0),
        exigenceISOAvecCorrespondancesNIS2(3),
      ];

      const entetes = strategieExport.entetes(exigences);

      assert.deepEqual(entetes.slice(5), [
        {
          id: 'reference_nis2_1',
          title: 'Référence exigence applicable à NIS 2 (1)',
        },
        {
          id: 'contenu_nis2_1',
          title: 'Contenu exigence applicable à NIS 2 (1)',
        },
        {
          id: 'reference_nis2_2',
          title: 'Référence exigence applicable à NIS 2 (2)',
        },
        {
          id: 'contenu_nis2_2',
          title: 'Contenu exigence applicable à NIS 2 (2)',
        },
        {
          id: 'reference_nis2_3',
          title: 'Référence exigence applicable à NIS 2 (3)',
        },
        {
          id: 'contenu_nis2_3',
          title: 'Contenu exigence applicable à NIS 2 (3)',
        },
      ]);
    });

    it('retourne les lignes des exigences ISO avec les correspondances', () => {
      const exigences = [
        new ExigenceISO({
          reference: '',
          contenu: '',
          norme: '271',
          chapitre: '9',
          correspondance: {
            exigences: [
              exigenceNIS2SansCorrespondance('refnis2-1', 'contenunis2-1'),
              exigenceNIS2SansCorrespondance('refnis2-2', 'contenunis2-2'),
            ],
            niveau: 'faible',
            observations: '',
          },
        }),
      ];

      const lignes = strategieExport.lignes(exigences);

      assert.deepEqual(lignes, [
        {
          reference: '',
          contenu: '',
          norme: '271',
          chapitre: '9',
          correspondance: 'faible',
          reference_nis2_1: 'refnis2-1',
          contenu_nis2_1: 'contenunis2-1',
          reference_nis2_2: 'refnis2-2',
          contenu_nis2_2: 'contenunis2-2',
        },
      ]);
    });
  });
});

const exigenceAEAvecCorrespondancesNIS2 = (nombreCorrespondances: number) =>
  new ExigenceAE({
    reference: '',
    contenu: '',
    correspondance: {
      exigences: new Array(nombreCorrespondances).map((_) =>
        exigenceNIS2SansCorrespondance()
      ),
      niveau: 'faible',
      observations: '',
    },
  });

const exigenceISOAvecCorrespondancesNIS2 = (nombreCorrespondances: number) =>
  new ExigenceISO({
    reference: '',
    contenu: '',
    norme: '2701',
    chapitre: 'chapitre 6',
    correspondance: {
      exigences: new Array(nombreCorrespondances).map((_) =>
        exigenceNIS2SansCorrespondance()
      ),
      niveau: 'faible',

      observations: '',
    },
  });

const exigenceNIS2SansCorrespondance = (
  reference: string = '',
  contenu: string = ''
) =>
  new ExigenceNIS2({
    reference,
    contenu,
    entitesCible: [],
    thematique: '',
    objectifSecurite: '',
  });

const exigenceNIS2AvecCorrespondancesISO = (nombreCorrespondances: number) =>
  exigenceNIS2AvecCorrespondances(nombreCorrespondances, 'ISO', exigenceISO);

const exigenceNIS2AvecCorrespondancesAE = (nombreCorrespondances: number) =>
  exigenceNIS2AvecCorrespondances(nombreCorrespondances, 'AE', exigenceAE);

const exigenceNIS2AvecCorrespondances = (
  nombreCorrespondances: number,
  referentielCompare: Referentiel,
  fnCreeExigence: () => Exigence
) =>
  new ExigenceNIS2({
    reference: '',
    contenu: '',
    entitesCible: [],
    thematique: '',
    objectifSecurite: '',
    referentielCompare,
    correspondance: {
      exigences: new Array(nombreCorrespondances).map((_) => fnCreeExigence()),
      niveau: 'faible',
      observations: '',
    },
  });

const exigenceISO = (reference: string = '', contenu: string = '') =>
  new ExigenceISO({
    reference,
    contenu,
    chapitre: '',
    norme: '',
    correspondance: { exigences: [], niveau: 'NA', observations: '' },
  });

const exigenceAE = (reference: string = '', contenu: string = '') =>
  new ExigenceAE({
    reference,
    contenu,
    correspondance: { exigences: [], niveau: 'NA', observations: '' },
  });
