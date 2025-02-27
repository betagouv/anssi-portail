import { beforeEach, describe, it } from "node:test";
import { Express } from "express";
import request from "supertest";
import assert from "node:assert";
import { ConfigurationServeur } from "../../../src/api/configurationServeur";
import { fabriqueMiddleware } from "../../../src/api/middleware";
import { creeServeur } from "../../../src/api/msc";
import { enObjet } from "../cookie";
import { fauxAdaptateurOIDC, fauxFournisseurDeChemin } from "../fauxObjets";

describe("La ressource apres authentification OIDC", () => {
  describe("quand on fait un GET sur /oidc/apres-authentification", () => {
    let serveur: Express;
    beforeEach(() => {
      const configurationServeur: ConfigurationServeur = {
        fournisseurChemin: fauxFournisseurDeChemin,
        middleware: fabriqueMiddleware(),
        adaptateurOIDC: fauxAdaptateurOIDC,
      };
      serveur = creeServeur(configurationServeur);
    });
    it("recois 200", async () => {
      const reponse = await request(serveur).get(
        "/oidc/apres-authentification"
      );

      assert.equal(reponse.status, 200);
    });
  });
});
