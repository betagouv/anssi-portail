import { describe, it, expect } from 'vitest';
import { leCSVDeProd } from './aidesAuxTests.js';
import { LecteurDeSpecifications } from '../../../../src/metier/nis2-simulateur/questionnaire/LecteurDeSpecifications.js';

describe('La lecture de la spécification complète en CSV', () => {
  it('se fait sans problème', () => {
    const lecteur = new LecteurDeSpecifications();
    const csv = leCSVDeProd();

    const specifications = lecteur.lis(csv);

    expect(specifications.nombre()).toBe(673);
  });
});
