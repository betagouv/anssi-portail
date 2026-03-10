import { describe, expect, it } from 'vitest';
import {
  fabriqueDExigence,
  formateContenuExigence,
  type ExigenceISO,
  type ExigenceNis2,
} from '../../src/nis2/exigence.type';
import { exigenceNIS2DeNiveauFaible } from './objetsPretsALEmploi';

describe("Le mapper de données de l'API", () => {
  it('sait lire les exigences NIS2', () => {
    const exigenceNis2DuBackend = {
      reference: 'EX-01',
      contenu: "Contenu de l'exigence 1",
      thematique: 'Gouvernance',
      objectifSecurite: "Assurer la sécurité des systèmes d'information",
      entitesCible: ['EntiteEssentielle', 'EntiteImportante'],
      correspondances: {
        ISO: { niveau: 'faible', exigences: [], observations: '' },
      },
    };

    const exigenceLue = fabriqueDExigence('NIS2', 'ISO', exigenceNis2DuBackend);

    expect(exigenceLue).toEqual({
      reference: 'EX-01',
      contenu: "Contenu de l'exigence 1",
      thematique: 'Gouvernance',
      objectifSecurite: "Assurer la sécurité des systèmes d'information",
      entitesCible: ['EntiteEssentielle', 'EntiteImportante'],
      correspondance: {
        niveau: 'faible',
        exigences: [],
        observations: '',
      },
    } satisfies ExigenceNis2);
  });

  it('sait lire les exigences ISO', () => {
    const exigenceISODuBackend = {
      reference: 'EX-02',
      contenu: "Contenu de l'exigence 2",
      norme: 'ISO 27001',
      chapitre: '5.1',
      correspondances: {
        NIS2: { niveau: 'faible', exigences: [], observations: '' },
      },
    };

    const exigenceLue = fabriqueDExigence('ISO', 'NIS2', exigenceISODuBackend);

    expect(exigenceLue).toEqual({
      reference: 'EX-02',
      contenu: "Contenu de l'exigence 2",
      norme: 'ISO 27001',
      chapitre: '5.1',
      correspondance: {
        niveau: 'faible',
        exigences: [],
        observations: '',
      },
    } satisfies ExigenceISO);
  });
});

describe('Le formatteur de contenu', () => {
  it('sait transformer les puces dans un texte en <li>', () => {
    const contenuDeBase = 'ligne1\n•puce1\n•puce2\nligne de fin';

    const contenuFormate = formateContenuExigence({
      ...exigenceNIS2DeNiveauFaible(),
      contenu: contenuDeBase,
    });

    expect(contenuFormate).equal(
      '<p>ligne1</p><ul><li>puce1</li><li>puce2</li></ul><p>ligne de fin</p>'
    );
  });

  it('sait transformer les puces à plusieurs niveau dans un texte en', () => {
    const contenuDeBase =
      'ligne1\n•puce1\no\tpuce1.1\no\tpuce1.2\n•puce2\nligne de fin';

    const contenuFormate = formateContenuExigence({
      ...exigenceNIS2DeNiveauFaible(),
      contenu: contenuDeBase,
    });

    expect(contenuFormate).equal(
      '<p>ligne1</p><ul><li>puce1</li><ul><li>puce1.1</li><li>puce1.2</li></ul><li>puce2</li></ul><p>ligne de fin</p>'
    );
  });
});
