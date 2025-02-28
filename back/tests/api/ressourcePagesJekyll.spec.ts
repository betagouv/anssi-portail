import { beforeEach, describe, it } from 'node:test';
import { Express } from 'express';
import request from 'supertest';
import { creeServeur } from '../../src/api/msc';
import assert from 'node:assert';
import { join } from 'path';
import { FournisseurChemin } from '../../src/api/fournisseurChemin';
import { fauxAdaptateurJWT, fauxAdaptateurOIDC, fauxFournisseurDeChemin } from './fauxObjets';
import { fabriqueMiddleware } from '../../src/api/middleware';

describe('La ressource pages jekyll', () => {
  let serveur: Express;

  let fournisseurChemin: FournisseurChemin;
  beforeEach(() => {
    fournisseurChemin = fauxFournisseurDeChemin;
    serveur = creeServeur({
      fournisseurChemin,
      middleware: fabriqueMiddleware(),
      adaptateurOIDC: fauxAdaptateurOIDC,
      adaptateurJWT: fauxAdaptateurJWT,
    });
  });

  describe('sur demande de la page catalogue', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/catalogue');

      assert.equal(reponse.status, 200);
    });

    it('renvoie un contenu html', async () => {
      const reponse = await request(serveur).get('/catalogue');

      assert.notEqual(reponse.headers['content-type'], undefined);
      assert.match(reponse.headers['content-type'], /html/);
    });

    it('sers le fichier html de jekyll', async () => {
      let nomPageDemande: string;
      fournisseurChemin.cheminPageJekyll = (nomPage: string) => {
        nomPageDemande = nomPage;
        return join(process.cwd(), 'tests', 'ressources', 'factice.html');
      };

      await request(serveur).get('/catalogue');

      assert.equal(nomPageDemande!, 'catalogue');
    });
  });
});
