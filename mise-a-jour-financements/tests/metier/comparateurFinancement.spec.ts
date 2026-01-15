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
    derniereModification: new Date('2026-01-14T15:54:00'),
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
      chercheAidesCyber: async () => [],
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

    it("indique que le financement n'existe pas si il n'est pas trouvé", async () => {
      adaptateurSourceExterne.parId = async () => undefined;

      await comparateur.chargeFinancements();
      const resultatComparaison = comparateur.compareSourceExterne();

      assert.deepEqual(resultatComparaison, [
        {
          idFinancement: 1,
          etat: 'supprimé',
        },
      ] satisfies DifferenceFinancement[]);
    });

    it('consulte les détails de chaque financement sur la source externe pour trouver des différences', async () => {
      adaptateurSourceExterne.parId = async () =>
        ({
          ...financement1,
          nom: 'Cyber PME 2026',
          financeur: "BPI France, Région Sud Provence-Alpes-Côte d'Azur",
          objectifs: 'objectif 2',
          operationsEligibles: 'Nouvelle Operation',
          benificiaires: 'Tout le monde sauf une personne',
          montant: 'Dix mille',
          condition: 'Savoir compter 2 par 2',
          derniereModification: new Date('2026-01-14T16:54:00'),
        } satisfies Financement);

      await comparateur.chargeFinancements();
      const resultatComparaison = comparateur.compareSourceExterne();

      assert.deepEqual(resultatComparaison, [
        {
          idFinancement: 1,
          donneesDifferentes: {
            nomDeLaDonnee: 'nom',
            valeurSurGrist: 'Cyber PME',
            nouvelleValeur: 'Cyber PME 2026',
          },
        },
        {
          idFinancement: 1,
          donneesDifferentes: {
            nomDeLaDonnee: 'financeur',
            valeurSurGrist: 'BPI France',
            nouvelleValeur: "BPI France, Région Sud Provence-Alpes-Côte d'Azur",
          },
        },
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
            nomDeLaDonnee: 'benificiaires',
            valeurSurGrist: 'Tout le monde',
            nouvelleValeur: 'Tout le monde sauf une personne',
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
        {
          idFinancement: 1,
          donneesDifferentes: {
            nomDeLaDonnee: 'condition',
            valeurSurGrist: 'Avoir 10 doigts',
            nouvelleValeur: 'Savoir compter 2 par 2',
          },
        },
      ] satisfies DifferenceFinancement[]);
    });

    it("ignore les financements sources qui n'ont pas évolués depuis la dernière vérification", async () => {
      adaptateurSourceExterne.parId = async () =>
        ({
          ...financement1,
          nom: 'Cyber PME 2026',
          financeur: "BPI France, Région Sud Provence-Alpes-Côte d'Azur",
          objectifs: 'objectif 2',
          operationsEligibles: 'Nouvelle Operation',
          benificiaires: 'Tout le monde sauf une personne',
          montant: 'Dix mille',
          condition: 'Savoir compter 2 par 2',
        } satisfies Financement);

      await comparateur.chargeFinancements();
      const resultatComparaison = comparateur.compareSourceExterne();

      assert.deepEqual(resultatComparaison, []);
    });
  });

  describe('détecte de nouvelles aides', () => {
    it('en cherchant des aides liées à la cyberscurité', async () => {
      adaptateurSourceExterne.chercheAidesCyber = async () =>
        [financement1] satisfies Financement[];
      const nouvellesAides = await comparateur.detecteNouvellesAides();

      assert.deepEqual(nouvellesAides, [financement1]);
    });
  });
});
