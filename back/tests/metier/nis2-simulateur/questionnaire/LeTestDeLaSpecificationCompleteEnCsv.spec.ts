import assert from 'node:assert';
import { describe, it } from 'node:test';
import { leCSVDeProd } from './aidesAuxTests';
import { LecteurDeSpecifications } from '../../../../src/metier/nis2-simulateur/questionnaire/LecteurDeSpecifications';

describe('La lecture de la spécification complète en CSV', () => {
  it('se fait sans problème', () => {
    const lecteur = new LecteurDeSpecifications();
    const csv = leCSVDeProd();

    const specifications = lecteur.lis(csv);

    assert.equal(specifications.nombre(), 673);
  });
});
