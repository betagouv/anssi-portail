import { beforeEach, describe, it } from 'node:test';
import { Express } from 'express';
import { FournisseurChemin } from '../../src/api/fournisseurChemin';
import { join } from 'path';
import { creeServeur } from '../../src/api/msc';
import request from 'supertest';
import assert from 'node:assert';
import {
  fauxAdaptateurJWT,
  fauxAdaptateurOIDC,
  fauxFournisseurDeChemin,
} from './fauxObjets';
import { fabriqueMiddleware } from '../../src/api/middleware';
import { EntrepotUtilisateurMemoire } from '../persistance/entrepotUtilisateurMemoire';

describe('La ressource page produit', () => {
  let serveur: Express;
  let fournisseurChemin: FournisseurChemin;

  beforeEach(() => {
    fournisseurChemin = fauxFournisseurDeChemin;
    serveur = creeServeur({
      fournisseurChemin,
      middleware: fabriqueMiddleware(),
      adaptateurOIDC: fauxAdaptateurOIDC,
      adaptateurJWT: fauxAdaptateurJWT,
      entrepotUtilisateur: new EntrepotUtilisateurMemoire(),
    });
  });

  describe("sur demande d'une page de service", () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get(
        '/services/mon-service-securise'
      );

      assert.equal(reponse.status, 200);
    });

    it('renvoie un contenu html', async () => {
      const reponse = await request(serveur).get(
        '/services/mon-service-securise'
      );

      assert.notEqual(reponse.headers['content-type'], undefined);
      assert.match(reponse.headers['content-type'], /html/);
    });

    it('sers le fichier html de jekyll', async () => {
      let idProduitDemande: string;
      let repertoireProduitsDemande: string;
      fournisseurChemin.cheminProduitJekyll = (
        repertoireProduits: string,
        idProduit: string
      ) => {
        idProduitDemande = idProduit;
        repertoireProduitsDemande = repertoireProduits;
        return join(process.cwd(), 'tests', 'ressources', 'factice.html');
      };

      await request(serveur).get('/services/mon-service-securise');

      assert.equal(repertoireProduitsDemande!, 'services');
      assert.equal(idProduitDemande!, 'mon-service-securise');
    });

    it("aseptise l'id du produit", async () => {
      let idProduitDemande: string;
      fournisseurChemin.cheminProduitJekyll = (
        _: string,
        idProduit: string
      ) => {
        idProduitDemande = idProduit;
        return join(process.cwd(), 'tests', 'ressources', 'factice.html');
      };

      await request(serveur).get('/services/mon>service');

      assert.equal(idProduitDemande!, 'mon&gt;service');
    });
  });

  it("sers un fichier sur demande d'une ressource", async () => {
    let idProduitDemande: string;
    let repertoireProduitsDemande: string;
    fournisseurChemin.cheminProduitJekyll = (
      repertoireProduits: string,
      idProduit: string
    ) => {
      idProduitDemande = idProduit;
      repertoireProduitsDemande = repertoireProduits;
      return join(process.cwd(), 'tests', 'ressources', 'factice.html');
    };

    const reponse = await request(serveur).get('/ressources/cot');

    assert.equal(reponse.status, 200);
    assert.notEqual(reponse.headers['content-type'], undefined);
    assert.match(reponse.headers['content-type'], /html/);
    assert.equal(repertoireProduitsDemande!, 'ressources');
    assert.equal(idProduitDemande!, 'cot');
  });
});
