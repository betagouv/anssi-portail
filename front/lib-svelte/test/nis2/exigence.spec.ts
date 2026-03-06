import { describe, expect, it } from 'vitest';
import {
  fabriqueDExigence,
  type ExigenceISO,
  type ExigenceNis2,
} from '../../src/nis2/exigence.type';

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
