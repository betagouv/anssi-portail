import { beforeEach, describe, it } from "node:test";
import { Express } from "express";
import request from "supertest";
import { creeServeur } from "../../src/api/msc";
import assert from "node:assert";
import { join } from "path";
import { FournisseurChemin } from "../../src/api/fournisseurChemin";

describe("La ressource profil", () => {
  let serveur: Express;
  let fournisseurChemin: FournisseurChemin;

  beforeEach(() => {
    fournisseurChemin = {
      getCheminPageJekyll: (nomPage: string) =>
        join(process.cwd(), "tests", "ressources", "factice.html"),
    };
    serveur = creeServeur({ fournisseurChemin });
  });

  describe("sur demande de la page catalogue", () => {
    it("répond 200", async () => {
      const reponse = await request(serveur).get("/catalogue");

      assert.equal(reponse.status, 200);
    });

    it("renvoie un contenu html", async () => {
      const reponse = await request(serveur).get("/catalogue");

      assert.notEqual(reponse.headers["content-type"], undefined);
      assert.match(reponse.headers["content-type"], /html/);
    });

    it("sers le fichier html de jekyll", async () => {
      let nomPageDemande: string;
      fournisseurChemin.getCheminPageJekyll = (nomPage: string) => {
        nomPageDemande = nomPage;
        return join(process.cwd(), "tests", "ressources", "factice.html");
      };

      const reponse = await request(serveur).get("/catalogue");

      assert.notEqual(reponse.headers["content-type"], undefined);
      assert.match(reponse.headers["content-type"], /html/);
      assert.equal(nomPageDemande!, "catalogue");
    });
  });
});
