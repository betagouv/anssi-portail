import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { AdaptateurSourceExterne } from '../../src/infra/adaptateurSourceExterne.js';
import { EntrepotFinancement } from '../../src/infra/entrepotFinancement.js';
import {
  ComparateurFinancement,
  DifferenceFinancement,
} from '../../src/metier/comparateurFinancement.js';
import { Financement } from '../../src/metier/financement.js';

describe('Le comparateur de financement', () => {
  const financement1: Financement = {
    id: 1,
    nom: 'Cyber PME',
    financeur: 'BPI France',
    objectifs: 'objectif 1',
    operationsEligibles: 'opération 2',
    benificiaires: 'Tout le monde',
    montant: 'Mille milliards',
    condition: 'Avoir 10 doigts',
  };

  let entrepotFinancement: EntrepotFinancement;
  let adaptateurSourceExterne: AdaptateurSourceExterne;
  let comparateur: ComparateurFinancement;

  beforeEach(() => {
    entrepotFinancement = {
      tous: async () => [financement1],
    };
    adaptateurSourceExterne = {
      parId: async () => financement1,
    };
    comparateur = new ComparateurFinancement(
      entrepotFinancement,
      adaptateurSourceExterne
    );
  });

  it("sait récupérer tous les financements de l'entrepot", async () => {
    await comparateur.chargeFinancements();

    assert.deepEqual(comparateur.financements, [financement1]);
  });

  describe("lorsqu'on compare un financement", () => {
    it("ne retourne rien si aucune différence n'est trouvée", async () => {
      await comparateur.chargeFinancements();
      const resultatComparaison = comparateur.compareSourceExterne();

      assert.deepEqual(resultatComparaison, []);
    });

    it('consulte les détails de chaque financement sur la source externe pour trouver des différences', async () => {
      adaptateurSourceExterne.parId = async () => ({
        ...financement1,
        objectifs: 'objectif 2',
        montant: 'Dix mille',
        operationsEligibles: 'Nouvelle Operation',
      });

      await comparateur.chargeFinancements();
      const resultatComparaison = comparateur.compareSourceExterne();

      assert.deepEqual(resultatComparaison, [
        {
          idFinancement: 1,
          donneesDifferentes: {
            nomDeLaDonnee: 'objectifs',
            valeurSurGrist: 'objectif 1',
            nouvelleValeur: 'objectif 2',
          },
        },
        {
          idFinancement: 1,
          donneesDifferentes: {
            nomDeLaDonnee: 'operationsEligibles',
            valeurSurGrist: 'opération 2',
            nouvelleValeur: 'Nouvelle Operation',
          },
        },
        {
          idFinancement: 1,
          donneesDifferentes: {
            nomDeLaDonnee: 'montant',
            valeurSurGrist: 'Mille milliards',
            nouvelleValeur: 'Dix mille',
          },
        },
      ] satisfies DifferenceFinancement[]);
    });
  });
});
