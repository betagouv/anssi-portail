import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { FichierInconnu, FournisseurChemin } from '../../src/api/fournisseurChemin.js';
import { creeServeur } from '../../src/api/msc.js';
import { configurationDeTestDuServeur, fauxFournisseurDeChemin, ressourceFactice } from './fauxObjets.js';

describe('La ressource page Service', () => {
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

      assert.equal(reponse.status, HttpStatusCode.Ok);
    });

    it('renvoie un contenu html', async () => {
      const reponse = await request(serveur).get('/services/mon-service-securise');

      assert.notEqual(reponse.headers['content-type'], undefined);
      assert.match(reponse.headers['content-type'], /html/);
    });

    it('sers le fichier html de jekyll', async () => {
      let idDemandé: string;
      fournisseurChemin.jekyll.service = (id: string) => {
        idDemandé = id;
        return ressourceFactice();
      };

      await request(serveur).get('/services/mon-service-securise');

      assert.equal(idDemandé!, 'mon-service-securise');
    });
  });

  it('redirige le service `Mon Espace NIS 2` vers la page NIS2', async () => {
    const reponse = await request(serveur).get('/services/mon-espace-nis2.html');

    assert.equal(reponse.status, HttpStatusCode.MovedPermanently);
    assert.equal(reponse.headers.location, '/nis2');
  });

  it('retourne une erreur 404 si la page n’est pas trouvée', async () => {
    fournisseurChemin.jekyll.service = (_id: string) => {
      throw new FichierInconnu('');
    };

    let estAppelé = false;
    fournisseurChemin.jekyll.page404 = () => {
      estAppelé = true;
      return ressourceFactice();
    };

    const réponse = await request(serveur).get('/services/inconnu').accept('text/html');

    assert.equal(réponse.status, HttpStatusCode.NotFound);
    assert.equal(réponse.headers['content-type'], 'text/html; charset=utf-8');
    assert.equal(estAppelé, true);
  });
});
