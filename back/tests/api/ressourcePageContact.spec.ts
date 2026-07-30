import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { FichierInconnu, FournisseurChemin } from '../../src/api/fournisseurChemin.js';
import { creeServeur } from '../../src/api/msc.js';
import { configurationDeTestDuServeur, fauxFournisseurDeChemin, ressourceFactice } from './fauxObjets.js';

describe('La ressource page Contact', () => {
  let serveur: Express;
  let fournisseurChemin: FournisseurChemin;

  beforeEach(() => {
    fournisseurChemin = fauxFournisseurDeChemin;
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      fournisseurChemin,
    });
  });

  describe("sur demande d'une page de contact", () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/contacts/fr-naq');

      assert.equal(reponse.status, 200);
    });

    it('renvoie un contenu html', async () => {
      const reponse = await request(serveur).get('/contacts/fr-naq');

      assert.notEqual(reponse.headers['content-type'], undefined);
      assert.match(reponse.headers['content-type'], /html/);
    });

    it('sers le fichier html de jekyll', async () => {
      let idDemandé: string;
      fournisseurChemin.jekyll.contact = (id: string) => {
        idDemandé = id;
        return ressourceFactice();
      };

      await request(serveur).get('/contacts/fr-naq');

      assert.equal(idDemandé!, 'fr-naq');
    });
  });

  it('retourne une erreur 404 si la page n’est pas trouvée', async () => {
    fournisseurChemin.jekyll.contact = (_id: string) => {
      throw new FichierInconnu('');
    };

    let estAppelé = false;
    fournisseurChemin.jekyll.page404 = () => {
      estAppelé = true;
      return ressourceFactice();
    };

    const réponse = await request(serveur).get('/contacts/inconnu').accept('text/html');

    assert.equal(réponse.status, 404);
    assert.equal(réponse.headers['content-type'], 'text/html; charset=utf-8');
    assert.equal(estAppelé, true);
  });
});
