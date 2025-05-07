import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { Express } from 'express';
import { EntrepotResultatTestMemoire } from '../../persistance/entrepotResultatTestMemoire';
import { configurationDeTestDuServeur } from '../fauxObjets';
import { creeServeur } from '../../../src/api/msc';
import { ResultatTestMaturite } from '../../../src/metier/resultatTestMaturite';
import { encodeSession } from '../cookie';
import assert from 'node:assert';
import { CodeRegion } from '../../../src/metier/referentielRegions';
import { CodeSecteur } from '../../../src/metier/referentielSecteurs';
import { CodeTrancheEffectif } from '../../../src/metier/referentielTranchesEffectifEtablissement';

describe('La ressource qui gère le dernier résultat de test', () => {
  let serveur: Express;
  let entrepotResultatTest: EntrepotResultatTestMemoire;
  let cookieJeanneDupont: string;

  beforeEach(() => {
    entrepotResultatTest = new EntrepotResultatTestMemoire();
    cookieJeanneDupont = encodeSession({
      email: 'jeanne.dupont@mail.com',
      token: 'token',
    });
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepotResultatTest,
    });
  });

  const donneesResultatTestCorrectes = () => ({
    emailUtilisateur: 'jeanne.dupont@mail.com',
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

  describe('sur requête GET', () => {
    describe('pour un utilisateur connecté', () => {
      const requeteGET = async () =>
        await request(serveur)
          .get('/api/resultats-test/dernier')
          .set('Cookie', [cookieJeanneDupont])
          .send();

      it('renvoie 200 et le dernier résultat de test ', async () => {
        await entrepotResultatTest.ajoute(
          new ResultatTestMaturite(donneesResultatTestCorrectes())
        );

        const reponse = await requeteGET();

        assert.equal(reponse.status, 200);
        assert.deepEqual(reponse.body, {
          reponses: {
            'prise-en-compte-risque': 2,
            pilotage: 3,
            budget: 5,
            'ressources-humaines': 3,
            'adoption-solutions': 2,
            posture: 3,
          },
        });
      });

      it("renvoie une erreur 404 lorsque l'utilisateur n'a pas de test", async () => {
        const reponse = await requeteGET();

        assert.equal(reponse.status, 404);
      });
    });

    describe('pour un utilisateur non connecté', () => {
      const requeteGET = async () =>
        await request(serveur).get('/api/resultats-test/dernier').send();

      it('renvoie une erreur 401', async () => {
        await entrepotResultatTest.ajoute(
          new ResultatTestMaturite(donneesResultatTestCorrectes())
        );

        const reponse = await requeteGET();

        assert.equal(reponse.status, 401);
      });
    });
  });
});
