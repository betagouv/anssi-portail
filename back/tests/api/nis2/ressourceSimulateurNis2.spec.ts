import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../../src/api/msc.js';
import { SimulationNis2Terminee } from '../../../src/bus/evenements/simulationNis2Terminee.js';
import { AdaptateurEnvironnement } from '../../../src/infra/adaptateurEnvironnement.js';
import { fabriqueBusPourLesTests, MockBusEvenement } from '../../bus/busPourLesTests.js';
import { configurationDeTestDuServeur, fauxAdaptateurEnvironnement } from '../fauxObjets.js';

describe('La ressource qui gère le simulateur NIS2', () => {
  let serveur: Express;
  let environnementDuTest: AdaptateurEnvironnement;
  let busEvenements: MockBusEvenement;

  beforeEach(() => {
    environnementDuTest = {
      ...fauxAdaptateurEnvironnement,
      fonctionnalites: () => ({
        ...fauxAdaptateurEnvironnement.fonctionnalites(),
        nis2: () => ({ afficheSimulateur: () => true, afficheCyFun23: () => true }),
      }),
    };
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

      expect(reponse.status).toBe(HttpStatusCode.Created);
    });

    it("publie sur le bus le résultat du test d'éligibilité", async () => {
      await request(serveur).post('/api/simulateur-nis2').send(reponseComplete());

      expect(busEvenements.aRecuUnEvenement(SimulationNis2Terminee)).toBe(true);
    });

    it("retourne 400 si le corps de la requête n'est pas un questionnaire correctement rempli", async () => {
      const { status } = await request(serveur).post('/api/simulateur-nis2').send({ question1: 'pas-un-booleen' });

      expect(status).toBe(HttpStatusCode.BadRequest);
    });
  });
});
