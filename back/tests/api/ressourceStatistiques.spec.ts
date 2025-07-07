import { beforeEach, describe, it } from 'node:test';
import { configurationDeTestDuServeur } from './fauxObjets';
import { creeServeur } from '../../src/api/msc';
import request from 'supertest';
import { Express } from 'express';
import assert from 'node:assert';
import { hectorDurant, jeanneDupont } from './objetsPretsALEmploi';
import { EntrepotUtilisateurMemoire } from '../persistance/entrepotUtilisateurMemoire';
import { EntrepotUtilisateur } from '../../src/metier/entrepotUtilisateur';
import { EntrepotResultatTestMemoire } from '../persistance/entrepotResultatTestMemoire';
import { EntrepotResultatTest } from '../../src/metier/entrepotResultatTest';
import { ResultatTestMaturite } from '../../src/metier/resultatTestMaturite';
import { CodeRegion } from '../../src/metier/referentielRegions';
import { CodeSecteur } from '../../src/metier/referentielSecteurs';
import { CodeTrancheEffectif } from '../../src/metier/referentielTranchesEffectifEtablissement';

describe('La ressource Statistiques', () => {
  describe('sur demande GET', () => {
    let serveur: Express;
    let entrepotUtilisateur: EntrepotUtilisateur;
    let entrepotResultatTest: EntrepotResultatTest;

    beforeEach(() => {
      entrepotUtilisateur = new EntrepotUtilisateurMemoire();
      entrepotResultatTest = new EntrepotResultatTestMemoire();
      serveur = creeServeur({
        ...configurationDeTestDuServeur,
        entrepotUtilisateur,
        entrepotResultatTest,
      });
    });

    it('renvoie 200', async () => {
      const reponse = await request(serveur).get('/api/statistiques');

      assert.equal(reponse.status, 200);
    });

    it("renvoie le nombre d'utilisateur inscrits", async () => {
      await entrepotUtilisateur.ajoute(jeanneDupont);
      await entrepotUtilisateur.ajoute(hectorDurant);

      const reponse = await request(serveur).get('/api/statistiques');

      assert.equal(reponse.body.utilisateursInscrits, 2);
    });

    it('renvoie le nombre de services et de ressources consultés', async () => {
      const reponse = await request(serveur).get('/api/statistiques');

      assert.equal(reponse.body.servicesEtRessourcesConsultes, 1787);
    });

    function creeResultatTest() {
      return new ResultatTestMaturite({
        utilisateur: jeanneDupont,
        region: 'FR-NOR' as CodeRegion,
        secteur: 'J' as CodeSecteur,
        tailleOrganisation: '51' as CodeTrancheEffectif,
        reponses: {
          'prise-en-compte-risque': 2,
          pilotage: 3,
          budget: 5,
          'ressources-humaines': 3,
          'adoption-solutions': 2,
          posture: 3,
        },
      });
    }

    it('renvoie le nombre de tests de maturité', async () => {
      await entrepotResultatTest.ajoute(creeResultatTest());
      await entrepotResultatTest.ajoute(creeResultatTest());
      await entrepotResultatTest.ajoute(creeResultatTest());

      const reponse = await request(serveur).get('/api/statistiques');

      assert.equal(reponse.body.testsMaturite.total, 3);
    });
  });
});
