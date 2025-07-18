import assert from 'node:assert';
import { describe, it } from 'node:test';
import { AdaptateurRechercheEntreprise } from '../../src/infra/adaptateurRechercheEntreprise';
import {
  IdNiveauMaturite,
  ReponsesTestMaturite,
  ResultatTestMaturite,
} from '../../src/metier/resultatTestMaturite';
import { jeanneDupont } from '../api/objetsPretsALEmploi';

const reponsesParDefaut: ReponsesTestMaturite = {
  'prise-en-compte-risque': 5,
  pilotage: 5,
  budget: 5,
  'ressources-humaines': 5,
  'adoption-solutions': 5,
  posture: 5,
};

const resultatAvecReponses = (
  reponses: ReponsesTestMaturite = reponsesParDefaut
) =>
  new ResultatTestMaturite({
    region: 'FR-NOR',
    secteur: 'J',
    tailleOrganisation: '51',
    reponses,
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

  describe('sur revendication de la propriété', () => {
    const adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise = {
      rechercheOrganisations: async (terme: string) => {
        if (terme === jeanneDupont.siretEntite) {
          return [
            {
              codeRegion: 'FR-ARA',
              codeSecteur: 'U',
              codeTrancheEffectif: '31',
              nom: '',
              departement: '',
              siret: jeanneDupont.siretEntite,
            },
          ];
        }
        return [];
      },
    };
    it('on recopie les informations de la recherche entreprise', async () => {
      const monResultat = new ResultatTestMaturite({
        reponses: reponsesParDefaut,
        region: undefined,
        secteur: undefined,
        tailleOrganisation: undefined,
      });

      await monResultat.revendiquePropriete(
        jeanneDupont,
        adaptateurRechercheEntreprise
      );

      assert.equal(monResultat.tailleOrganisation, '31');
      assert.equal(monResultat.secteur, 'U');
      assert.equal(monResultat.region, 'FR-ARA');
    });

    it('on ne recopie pas les informations de la recherche entreprise déjà présentes dans le test', async () => {
      const monResultat = new ResultatTestMaturite({
        reponses: reponsesParDefaut,
        region: 'FR-20R',
        secteur: 'A',
        tailleOrganisation: '11',
      });

      await monResultat.revendiquePropriete(
        jeanneDupont,
        adaptateurRechercheEntreprise
      );

      assert.equal(monResultat.tailleOrganisation, '11');
      assert.equal(monResultat.secteur, 'A');
      assert.equal(monResultat.region, 'FR-20R');
    });
  });
});
