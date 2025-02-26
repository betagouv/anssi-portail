import { beforeEach, describe, it } from "node:test";
import { Express } from "express";
import { join } from "path";
import request from "supertest";
import assert from "node:assert";
import { creeServeur } from "../../src/api/msc";
import { ConfigurationServeur } from "../../src/api/configurationServeur";
import { fauxFournisseurDeChemin } from "./fauxObjets";
import { fabriqueMiddleware } from "../../src/api/middleware";
import {adaptateurOIDC} from "../../src/api/adaptateurOIDC";

describe("La ressource connexion OIDC", () => {
  describe("quand on requete GET sur /oidc/connexion", () => {
    it("redirige vers l'adresse proconnect", async () => {
      const configurationServeur: ConfigurationServeur = {
        fournisseurChemin: fauxFournisseurDeChemin,
        middleware: fabriqueMiddleware(),
        adaptateurOIDC: {
          genereDemandeAutorisation: async () => {
            return Promise.resolve({
              url: "une-adresse-proconnect",
              state: "un faux state",
              nonce: "un faux nonce",
            });
          },
        },
      };
      let serveur = creeServeur(configurationServeur);

      const reponse = await request(serveur).get("/oidc/connexion");

      assert.equal(reponse.status, 302);
      assert.equal(reponse.headers.location, "une-adresse-proconnect");
    });
  });
});
