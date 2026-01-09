import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { AdaptateurSourceExterne } from '../../src/infra/adaptateurSourceExterne.js';
import { EntrepotFinancement } from '../../src/infra/entrepotFinancement.js';
import { ComparateurFinancement } from '../../src/metier/comparateurFinancement.js';
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
      const resultatComparaison = await comparateur.compareSourceExterne();

      assert.deepEqual(resultatComparaison, []);
    });
  });

  describe('consulte les détails de chaque financement sur la source externe pour trouver des différences', () => {
    it("sur l'objectif", async () => {
      adaptateurSourceExterne.parId = async () => ({
        ...financement1,
        objectifs: 'objectif 2',
      });

      await comparateur.chargeFinancements();
      const resultatComparaison = await comparateur.compareSourceExterne();

      assert.deepEqual(resultatComparaison, [
        {
          idFinancement: 1,
          donneesDifferentes: {
            nomDeLaDonnee: 'objectifs',
            valeurSurGrist: 'objectif 1',
            nouvelleValeur: 'objectif 2',
          },
        },
      ]);
    });

    it('sur le montant', async () => {
      adaptateurSourceExterne.parId = async () => ({
        ...financement1,
        montant: 'Dix mille',
      });

      await comparateur.chargeFinancements();
      const resultatComparaison = await comparateur.compareSourceExterne();

      assert.deepEqual(resultatComparaison, [
        {
          idFinancement: 1,
          donneesDifferentes: {
            nomDeLaDonnee: 'montant',
            valeurSurGrist: 'Mille milliards',
            nouvelleValeur: 'Dix mille',
          },
        },
      ]);
    });
  });
});
