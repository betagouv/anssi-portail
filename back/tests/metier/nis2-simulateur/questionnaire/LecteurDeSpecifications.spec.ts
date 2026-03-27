import assert from 'node:assert';
import { describe, it } from 'node:test';
import { leCSV } from './aidesAuxTests';
import { LecteurDeSpecifications } from '../../../../src/metier/nis2-simulateur/questionnaire/LecteurDeSpecifications';

describe('Le lecteur de spécifications', () => {
  it('utilise un fichier CSV pour produire un tableau de toutes les spécifications', () => {
    const lecteur = new LecteurDeSpecifications();
    const fichier = leCSV('specification-une-ligne.csv');

    const specifications = lecteur.lis(fichier);

    assert.equal(specifications.nombre(), 1);
  });

  it('lève une exception si les colonnes du CSV ne sont pas celles attendues', () => {
    assert.throws(
      () => new LecteurDeSpecifications().lis(leCSV('specification-colonne-manquante.csv')),
      /manque des colonnes/
    );
  });
});
