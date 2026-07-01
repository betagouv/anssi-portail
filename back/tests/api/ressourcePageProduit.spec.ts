import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { join } from 'path';
import request from 'supertest';
import { FichierInconnu, FournisseurChemin } from '../../src/api/fournisseurChemin.js';
import { creeServeur } from '../../src/api/msc.js';
import { configurationDeTestDuServeur, fauxFournisseurDeChemin } from './fauxObjets.js';

describe('La ressource page produit', () => {
  let serveur: Express;
  let fournisseurChemin: FournisseurChemin;

  beforeEach(() => {
    fournisseurChemin = fauxFournisseurDeChemin;
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      fournisseurChemin,
    });
  });

  describe("sur demande d'une page de service", () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/services/mon-service-securise');

      assert.equal(reponse.status, 200);
    });

    it('renvoie un contenu html', async () => {
      const reponse = await request(serveur).get('/services/mon-service-securise');

      assert.notEqual(reponse.headers['content-type'], undefined);
      assert.match(reponse.headers['content-type'], /html/);
    });

    it('sers le fichier html de jekyll', async () => {
      let idProduitDemande: string;
      let repertoireProduitsDemande: string;
      fournisseurChemin.cheminProduitJekyll = (repertoireProduits: string, idProduit: string) => {
        idProduitDemande = idProduit;
        repertoireProduitsDemande = repertoireProduits;
        return join(process.cwd(), 'tests', 'ressources', 'factice.html');
      };

      await request(serveur).get('/services/mon-service-securise');

      assert.equal(repertoireProduitsDemande!, 'services');
      assert.equal(idProduitDemande!, 'mon-service-securise');
    });
  });

  it("sers un fichier sur demande d'une ressource", async () => {
    let idProduitDemande: string;
    let repertoireProduitsDemande: string;
    fournisseurChemin.cheminProduitJekyll = (repertoireProduits: string, idProduit: string) => {
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

  it('redirige le service `Mon Espace NIS 2` vers la page NIS2', async () => {
    const reponse = await request(serveur).get('/services/mon-espace-nis2.html');

    assert.equal(reponse.status, 301);
    assert.equal(reponse.headers.location, '/nis2');
  });

  it('retourne une erreur 404 si la page n’est pas trouvée', async () => {
    fournisseurChemin.cheminProduitJekyll = (_repertoireProduits: string, _idProduit: string) => {
      throw new FichierInconnu('');
    };
    let nomFichierAppele = '';
    fournisseurChemin.ressourceDeBase = (nomFichier: string) => {
      nomFichierAppele = nomFichier;
      return join(process.cwd(), 'tests', 'ressources', 'factice.html');
    };

    const reponse = await request(serveur).get('/services/inconnu').accept('text/html');

    assert.equal(reponse.status, 404);
    assert.equal(reponse.headers['content-type'], 'text/html; charset=utf-8');
    assert.equal(nomFichierAppele, '404.html');
  });
});
