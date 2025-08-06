import { describe, expect, it } from 'vitest';
import type { RepartitionResultatsTestPourUnNiveau } from '../../src/test-maturite/ResultatsTest.type';
import { construisSerie } from '../../src/test-maturite/resultatTest';

describe('Construit une Serie à partir une liste de répartition de test', () => {
  const valeurs = {
    'adoption-solutions': 1,
    'prise-en-compte-risque': 2,
    'ressources-humaines': 3,
    budget: 4,
    pilotage: 5,
    posture: 1,
  };
  it('quand la liste est vide', () => {
    const serie = construisSerie({ repartitions: [] });

    expect(serie).toEqual([
      {
        libelle: 'Insuffisant',
        valeur: 0,
      },
      {
        libelle: 'Émergent',
        valeur: 0,
      },
      {
        libelle: 'Intermédiaire',
        valeur: 0,
      },
      {
        libelle: 'Confirmé',
        valeur: 0,
      },
      {
        libelle: 'Optimal',
        valeur: 0,
      },
    ]);
  });

  it('quand la liste contient un niveau', () => {
    const repartitions: RepartitionResultatsTestPourUnNiveau[] = [
      {
        id: 'insuffisant',
        ratio: 0.33,
        totalNombreTests: 3,
        valeurs,
      },
    ];

    const serie = construisSerie({ repartitions });

    expect(serie).toEqual([
      {
        libelle: 'Insuffisant',
        valeur: 3,
      },
      {
        libelle: 'Émergent',
        valeur: 0,
      },
      {
        libelle: 'Intermédiaire',
        valeur: 0,
      },
      {
        libelle: 'Confirmé',
        valeur: 0,
      },
      {
        libelle: 'Optimal',
        valeur: 0,
      },
    ]);
  });

  it('quand la liste contient tous les niveaux', () => {
    const repartitions: RepartitionResultatsTestPourUnNiveau[] = [
      {
        id: 'insuffisant',
        ratio: 0.22,
        totalNombreTests: 22,
        valeurs,
      },
      {
        id: 'emergent',
        ratio: 0.31,
        totalNombreTests: 31,
        valeurs,
      },
      {
        id: 'intermediaire',
        ratio: 0.33,
        totalNombreTests: 33,
        valeurs,
      },
      {
        id: 'confirme',
        ratio: 0.12,
        totalNombreTests: 12,
        valeurs,
      },
      {
        id: 'optimal',
        ratio: 0.02,
        totalNombreTests: 2,
        valeurs,
      },
    ];

    const serie = construisSerie({ repartitions });

    expect(serie).toEqual([
      {
        libelle: 'Insuffisant',
        valeur: 22,
      },
      {
        libelle: 'Émergent',
        valeur: 31,
      },
      {
        libelle: 'Intermédiaire',
        valeur: 33,
      },
      {
        libelle: 'Confirmé',
        valeur: 12,
      },
      {
        libelle: 'Optimal',
        valeur: 2,
      },
    ]);
  });

  it('et se base sur les ratios quand spécifié', () => {
    const repartitions: RepartitionResultatsTestPourUnNiveau[] = [
      {
        id: 'insuffisant',
        ratio: 0.22,
        valeurs,
      },
      {
        id: 'emergent',
        ratio: 0.31,
        valeurs,
      },
      {
        id: 'intermediaire',
        ratio: 0.33,
        valeurs,
      },
      {
        id: 'confirme',
        ratio: 0.12,
        valeurs,
      },
      {
        id: 'optimal',
        ratio: 0.02,
        valeurs,
      },
    ];

    const serie = construisSerie({ repartitions, mode: 'ratio' });

    expect(serie).toEqual([
      {
        libelle: 'Insuffisant',
        valeur: 22,
      },
      {
        libelle: 'Émergent',
        valeur: 31,
      },
      {
        libelle: 'Intermédiaire',
        valeur: 33,
      },
      {
        libelle: 'Confirmé',
        valeur: 12,
      },
      {
        libelle: 'Optimal',
        valeur: 2,
      },
    ]);
  });
});
