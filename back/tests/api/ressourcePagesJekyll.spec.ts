import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { join } from 'path';
import request from 'supertest';
import { FournisseurChemin } from '../../src/api/fournisseurChemin';
import { creeServeur } from '../../src/api/msc';
import {
  configurationDeTestDuServeur,
  fauxFournisseurDeChemin,
} from './fauxObjets';

describe('La ressource pages jekyll', () => {
  let serveur: Express;
  let fournisseurChemin: FournisseurChemin;

  beforeEach(() => {
    fournisseurChemin = fauxFournisseurDeChemin;
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      fournisseurChemin,
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

  describe('sur demande de la page favoris partagés', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get(
        '/favoris-partages/monSuperId'
      );

      assert.equal(reponse.status, 200);
    });

    it('renvoie un contenu html', async () => {
      const reponse = await request(serveur).get(
        '/favoris-partages/monSuperId'
      );

      assert.notEqual(reponse.headers['content-type'], undefined);
      assert.match(reponse.headers['content-type'], /html/);
    });

    it('sers le fichier html de jekyll', async () => {
      let nomPageDemande: string;
      fournisseurChemin.cheminPageJekyll = (nomPage: string) => {
        nomPageDemande = nomPage;
        return join(process.cwd(), 'tests', 'ressources', 'factice.html');
      };

      await request(serveur).get('/favoris-partages/monSuperId');

      assert.equal(nomPageDemande!, 'favoris-partages');
    });
  });

  describe('sur demande de la page liste des contacts', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/contacts');

      assert.equal(reponse.status, 200);
    });

    it('renvoie un contenu html', async () => {
      const reponse = await request(serveur).get('/contacts');

      assert.notEqual(reponse.headers['content-type'], undefined);
      assert.match(reponse.headers['content-type'], /html/);
    });

    it('sers le fichier html de jekyll', async () => {
      let nomPageDemande: string;
      fournisseurChemin.cheminPageJekyll = (nomPage: string) => {
        nomPageDemande = nomPage;
        return join(process.cwd(), 'tests', 'ressources', 'factice.html');
      };

      await request(serveur).get('/contacts');

      assert.equal(nomPageDemande!, 'contacts');
    });
  });

  describe('sur demande de la page contacts', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/contacts/FR-IDF');

      assert.equal(reponse.status, 200);
    });

    it('renvoie un contenu html', async () => {
      const reponse = await request(serveur).get('/contacts/FR-IDF');

      assert.notEqual(reponse.headers['content-type'], undefined);
      assert.match(reponse.headers['content-type'], /html/);
    });

    it('sers le fichier html de jekyll', async () => {
      let nomPageDemande: string;
      fournisseurChemin.cheminPageJekyll = (nomPage: string) => {
        nomPageDemande = nomPage;
        return join(process.cwd(), 'tests', 'ressources', 'factice.html');
      };

      await request(serveur).get('/contacts/FR-IDF');

      assert.equal(nomPageDemande!, 'contacts');
    });
  });

  describe("sur demande d'un guide", () => {
    it('répond un 200', async () => {
      const reponse = await request(serveur).get('/guides/zero-trust');

      assert.equal(reponse.status, 200);
    });

    it('renvoie un contenu html', async () => {
      const reponse = await request(serveur).get('/guides/zero-trust');

      assert.notEqual(reponse.headers['content-type'], undefined);
      assert.match(reponse.headers['content-type'], /html/);
    });

    it('sers le fichier html de jekyll', async () => {
      let nomPageDemande: string;
      fournisseurChemin.cheminPageJekyll = (nomPage: string) => {
        nomPageDemande = nomPage;
        return join(process.cwd(), 'tests', 'ressources', 'factice.html');
      };

      await request(serveur).get('/guides/zero-trust');

      assert.equal(nomPageDemande!, 'guides');
    });
  });

  describe("sur demande de l'ancienne page NIS2", () => {
    it('redirige vers la sélection de la nouvelle page NIS2', async () => {
      const reponse = await request(serveur).get('/nis2');

      assert.equal(reponse.status, 301);
      assert.equal(reponse.headers.location, '/directive-nis2#solutions');
    });
  });
});
