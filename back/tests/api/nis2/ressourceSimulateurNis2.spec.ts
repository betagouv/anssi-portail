import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import assert from 'node:assert';
import { Express } from 'express';
import { configurationDeTestDuServeur, fauxAdaptateurEnvironnement } from '../fauxObjets';
import { creeServeur } from '../../../src/api/msc';
import { AdaptateurEnvironnement } from '../../../src/infra/adaptateurEnvironnement';
import { fabriqueBusPourLesTests, MockBusEvenement } from '../../bus/busPourLesTests';
import { SimulationNis2Terminee } from '../../../src/bus/evenements/simulationNis2Terminee';

describe('La ressource qui gère le simulateur NIS2', () => {
  let serveur: Express;
  let environnementDuTest: AdaptateurEnvironnement;
  let busEvenements: MockBusEvenement;

  beforeEach(() => {
    environnementDuTest = {
      ...fauxAdaptateurEnvironnement,
      fonctionnalites: () => ({ nis2: () => ({ afficheSimulateur: () => true }) }),
    } as unknown as AdaptateurEnvironnement;
    busEvenements = fabriqueBusPourLesTests();

    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      adaptateurEnvironnement: environnementDuTest,
      busEvenements,
    });
  });

  describe('sur requête POST', () => {
    const reponseComplete = () => ({
      etapeCourante: 'resultat',
      designationOperateurServicesEssentiels: ['nsp'],
      appartenancePaysUnionEuropeenne: ['france'],
      typeStructure: ['privee'],
      trancheNombreEmployes: ['petit'],
      trancheChiffreAffaire: ['petit'],
      trancheBilanFinancier: [],
      secteurActivite: ['banqueSecteurBancaire'],
      sousSecteurActivite: [],
      activites: ['etablissementCredit'],
      typeEntitePublique: [],
      localisationFournitureServicesNumeriques: [],
      paysDecisionsCyber: [],
      paysOperationsCyber: [],
      paysPlusGrandNombreSalaries: [],
    });

    it('répond 201', async () => {
      const reponse = await request(serveur).post('/api/simulateur-nis2').send(reponseComplete());

      assert.equal(reponse.status, 201);
    });

    it("publie sur le bus le résultat du test d'éligibilité", async () => {
      await request(serveur).post('/api/simulateur-nis2').send(reponseComplete());

      assert.equal(busEvenements.aRecuUnEvenement(SimulationNis2Terminee), true);
    });

    it("retourne 400 si le corps de la requête n'est pas un questionnaire correctement rempli", async () => {
      const { status } = await request(serveur).post('/api/simulateur-nis2').send({ question1: 'pas-un-booleen' });

      assert.equal(status, 400);
    });
  });
});
