import {beforeEach, describe, it} from "node:test";
import {Express} from "express";
import {creeServeur} from "../../src/api/msc";
import {fauxAdaptateurJWT, fauxAdaptateurOIDC, fauxFournisseurDeChemin} from "./fauxObjets";
import {fabriqueMiddleware} from "../../src/api/middleware";
import request from "supertest";
import assert from "node:assert";
import {fabriqueBusPourLesTests, MockBusEvenement} from "../bus/busPourLesTests";
import {TestRealise} from "../../src/bus/testRealise";

describe("La ressource qui gère les résultats de test de maturité", () => {
  let serveur: Express;
  let busEvenement: MockBusEvenement;

  beforeEach(() => {
    busEvenement = fabriqueBusPourLesTests();
    serveur = creeServeur({
      fournisseurChemin: fauxFournisseurDeChemin,
      middleware: fabriqueMiddleware(),
      adaptateurOIDC: fauxAdaptateurOIDC,
      adaptateurJWT: fauxAdaptateurJWT,
      busEvenement
    });
  });

  describe("sur requête POST", () => {
    it("répond 201", async () => {
      const reponse = await request(serveur).post('/api/resultats-test');

      assert.equal(reponse.status, 201);
    })

    it("publie un évènement du bus TestRealise", async () => {
      await request(serveur).post('/api/resultats-test');

      busEvenement.aRecuUnEvenement(TestRealise);
    })
  })
})