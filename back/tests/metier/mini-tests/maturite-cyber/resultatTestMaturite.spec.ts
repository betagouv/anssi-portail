import { describe, expect, it } from 'vitest';
import { AdaptateurRechercheEntreprise } from '../../../../src/infra/adaptateurRechercheEntreprise.js';
import { IdNiveauMaturite } from '../../../../src/metier/mini-tests/maturite-cyber/resultatTestMaturite.js';
import { fauxAdaptateurRechercheEntreprise } from '../../../api/fauxObjets.js';
import { unRésultatDeTestDeMaturité } from '../../../api/mini-tests/maturite-cyber/constructeurResultatTestMaturite.js';
import { jeanneDupont } from '../../../api/objetsPretsALEmploi.js';

describe('Le résultat du test de maturité', () => {
  describe('sur demande de son niveau', () => {
    it('retourne insuffisant si la moyenne des points des réponses est strictement inférieure à 1', async () => {
      const resultatTest = await unRésultatDeTestDeMaturité()
        .avecRéponses({
          'prise-en-compte-risque': 1,
          pilotage: 1,
          budget: 1,
          'ressources-humaines': 2,
          'adoption-solutions': 2,
          posture: 2,
        })
        .construis();

      const niveau: IdNiveauMaturite = resultatTest.niveau();

      expect(niveau).toBe('insuffisant');
    });

    it('retourne emergent si la moyenne des points des réponses est strictement inférieure à 2', async () => {
      const resultatTest = await unRésultatDeTestDeMaturité()
        .avecRéponses({
          'prise-en-compte-risque': 3,
          pilotage: 3,
          budget: 3,
          'ressources-humaines': 2,
          'adoption-solutions': 2,
          posture: 2,
        })
        .construis();

      const niveau: IdNiveauMaturite = resultatTest.niveau();

      expect(niveau).toBe('emergent');
    });

    it('retourne intermediaire si la moyenne des points des réponses est strictement inférieure à 3', async () => {
      const resultatTest = await unRésultatDeTestDeMaturité()
        .avecRéponses({
          'prise-en-compte-risque': 3,
          pilotage: 3,
          budget: 3,
          'ressources-humaines': 4,
          'adoption-solutions': 4,
          posture: 4,
        })
        .construis();

      const niveau: IdNiveauMaturite = resultatTest.niveau();

      expect(niveau).toBe('intermediaire');
    });

    it('retourne confirme si la moyenne des points des réponses est strictement inférieure à 4', async () => {
      const resultatTest = await unRésultatDeTestDeMaturité()
        .avecRéponses({
          'prise-en-compte-risque': 5,
          pilotage: 5,
          budget: 5,
          'ressources-humaines': 4,
          'adoption-solutions': 4,
          posture: 4,
        })
        .construis();

      const niveau: IdNiveauMaturite = resultatTest.niveau();

      expect(niveau).toBe('confirme');
    });

    it('retourne confirme si la moyenne des points des réponses est égale à 4', async () => {
      const resultatTest = await unRésultatDeTestDeMaturité()
        .avecRéponses({
          'prise-en-compte-risque': 5,
          pilotage: 5,
          budget: 5,
          'ressources-humaines': 5,
          'adoption-solutions': 5,
          posture: 5,
        })
        .construis();

      const niveau: IdNiveauMaturite = resultatTest.niveau();

      expect(niveau).toBe('optimal');
    });
  });

  describe('sur revendication de la propriété', () => {
    const adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise = {
      ...fauxAdaptateurRechercheEntreprise,
      rechercheOrganisation: async (terme: string) => {
        if (terme === jeanneDupont.siretEntite) {
          return {
            codeRegion: 'FR-ARA',
            codeSecteur: 'U',
            codeTrancheEffectif: '31',
            nom: '',
            departement: '',
            siret: jeanneDupont.siretEntite,
            estAssociation: false,
            estCollectivite: false,
            codeActivite: '62.01Z',
          };
        }
        return;
      },
    };

    it('on recopie les informations de la recherche entreprise', async () => {
      const monResultat = await unRésultatDeTestDeMaturité()
        .avecRégion(undefined)
        .avecSecteur(undefined)
        .avecTailleOrganisation(undefined)
        .construis();

      await monResultat.revendiquePropriete(jeanneDupont, adaptateurRechercheEntreprise);

      expect(monResultat.tailleOrganisation).toBe('31');
      expect(monResultat.secteur).toBe('U');
      expect(monResultat.region).toBe('FR-ARA');
    });

    it('on ne recopie pas les informations de la recherche entreprise déjà présentes dans le test', async () => {
      const monResultat = await unRésultatDeTestDeMaturité()
        .avecRégion('FR-20R')
        .avecSecteur('A')
        .avecTailleOrganisation('11')
        .construis();

      await monResultat.revendiquePropriete(jeanneDupont, adaptateurRechercheEntreprise);

      expect(monResultat.tailleOrganisation).toBe('11');
      expect(monResultat.secteur).toBe('A');
      expect(monResultat.region).toBe('FR-20R');
    });
  });
});
