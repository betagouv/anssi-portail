import { beforeEach, describe, it } from "node:test";
import { Express } from "express";
import { FournisseurChemin } from "../../src/api/fournisseurChemin";
import { join } from "path";
import { creeServeur } from "../../src/api/msc";
import request from "supertest";
import assert from "node:assert";
import { fauxFournisseurDeChemin } from "./fauxObjets";

describe("La ressource page produit", () => {
  let serveur: Express;
  let fournisseurChemin: FournisseurChemin;

  beforeEach(() => {
    fournisseurChemin = fauxFournisseurDeChemin;
    serveur = creeServeur({ fournisseurChemin });
  });

  describe("sur demande d'une page de service", () => {
    it("répond 200", async () => {
      const reponse = await request(serveur).get(
        "/services/mon-service-securise",
      );

      assert.equal(reponse.status, 200);
    });

    it("renvoie un contenu html", async () => {
      const reponse = await request(serveur).get(
        "/services/mon-service-securise",
      );

      assert.notEqual(reponse.headers["content-type"], undefined);
      assert.match(reponse.headers["content-type"], /html/);
    });

    it("sers le fichier html de jekyll", async () => {
      let idProduitDemande: string;
      let repertoireProduitsDemande: string;
      fournisseurChemin.getCheminProduitJekyll = (
        repertoireProduits: string,
        idProduit: string,
      ) => {
        idProduitDemande = idProduit;
        repertoireProduitsDemande = repertoireProduits;
        return join(process.cwd(), "tests", "ressources", "factice.html");
      };

      await request(serveur).get("/services/mon-service-securise");

      assert.equal(repertoireProduitsDemande!, "services");
      assert.equal(idProduitDemande!, "mon-service-securise");
    });
  });

  it("sers un fichier sur demande d'une ressource", async () => {
    let idProduitDemande: string;
    let repertoireProduitsDemande: string;
    fournisseurChemin.getCheminProduitJekyll = (
      repertoireProduits: string,
      idProduit: string,
    ) => {
      idProduitDemande = idProduit;
      repertoireProduitsDemande = repertoireProduits;
      return join(process.cwd(), "tests", "ressources", "factice.html");
    };

    const reponse = await request(serveur).get("/ressources/cot");

    assert.equal(reponse.status, 200);
    assert.notEqual(reponse.headers["content-type"], undefined);
    assert.match(reponse.headers["content-type"], /html/);
    assert.equal(repertoireProduitsDemande!, "ressources");
    assert.equal(idProduitDemande!, "cot");
  });
});
