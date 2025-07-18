import { describe, it } from 'node:test';
import {
  IdNiveauMaturite,
  ReponsesTestMaturite,
  ResultatTestMaturite,
} from '../../src/metier/resultatTestMaturite';
import assert from 'node:assert';

const resultatAvecReponses = (reponses: ReponsesTestMaturite) =>
  new ResultatTestMaturite({
    region: 'FR-NOR',
    secteur: 'J',
    tailleOrganisation: '51',
    reponses,
    utilisateur: undefined,
  });

describe('Le résultat du test de maturité', () => {
  describe('sur demande de son niveau', () => {
    it('retourne insuffisant si la moyenne des points des réponses est strictement inférieure à 1', () => {
      const resultatTest = resultatAvecReponses({
        'prise-en-compte-risque': 1,
        pilotage: 1,
        budget: 1,
        'ressources-humaines': 2,
        'adoption-solutions': 2,
        posture: 2,
      });

      const niveau: IdNiveauMaturite = resultatTest.niveau();

      assert.equal(niveau, 'insuffisant');
    });

    it('retourne emergent si la moyenne des points des réponses est strictement inférieure à 2', () => {
      const resultatTest = resultatAvecReponses({
        'prise-en-compte-risque': 3,
        pilotage: 3,
        budget: 3,
        'ressources-humaines': 2,
        'adoption-solutions': 2,
        posture: 2,
      });

      const niveau: IdNiveauMaturite = resultatTest.niveau();

      assert.equal(niveau, 'emergent');
    });

    it('retourne intermediaire si la moyenne des points des réponses est strictement inférieure à 3', () => {
      const resultatTest = resultatAvecReponses({
        'prise-en-compte-risque': 3,
        pilotage: 3,
        budget: 3,
        'ressources-humaines': 4,
        'adoption-solutions': 4,
        posture: 4,
      });

      const niveau: IdNiveauMaturite = resultatTest.niveau();

      assert.equal(niveau, 'intermediaire');
    });

    it('retourne confirme si la moyenne des points des réponses est strictement inférieure à 4', () => {
      const resultatTest = resultatAvecReponses({
        'prise-en-compte-risque': 5,
        pilotage: 5,
        budget: 5,
        'ressources-humaines': 4,
        'adoption-solutions': 4,
        posture: 4,
      });

      const niveau: IdNiveauMaturite = resultatTest.niveau();

      assert.equal(niveau, 'confirme');
    });

    it('retourne confirme si la moyenne des points des réponses est égale à 4', () => {
      const resultatTest = resultatAvecReponses({
        'prise-en-compte-risque': 5,
        pilotage: 5,
        budget: 5,
        'ressources-humaines': 5,
        'adoption-solutions': 5,
        posture: 5,
      });

      const niveau: IdNiveauMaturite = resultatTest.niveau();

      assert.equal(niveau, 'optimal');
    });
  });
});
