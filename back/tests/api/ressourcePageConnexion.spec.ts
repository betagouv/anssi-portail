import { beforeEach, describe, it } from 'node:test';
import { Express } from 'express';
import request from 'supertest';
import { creeServeur } from '../../src/api/msc';
import assert from 'node:assert';
import { join } from 'path';
import { FournisseurChemin } from '../../src/api/fournisseurChemin';
import {
  configurationDeTestDuServeur,
  fauxFournisseurDeChemin,
} from './fauxObjets';
import { encodeSession, enObjet } from './cookie';

describe('La ressource de la page connexion', () => {
  let serveur: Express;
  let fournisseurChemin: FournisseurChemin;

  beforeEach(() => {
    fournisseurChemin = fauxFournisseurDeChemin;
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      fournisseurChemin,
    });
  });

  describe('sur demande de la page', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/connexion');

      assert.equal(reponse.status, 200);
    });

    it('renvoie un contenu html', async () => {
      const reponse = await request(serveur).get('/connexion');

      assert.notEqual(reponse.headers['content-type'], undefined);
      assert.match(reponse.headers['content-type'], /html/);
    });

    it('sers le fichier html de jekyll', async () => {
      let nomPageDemande: string;
      fournisseurChemin.cheminPageJekyll = (nomPage: string) => {
        nomPageDemande = nomPage;
        return join(process.cwd(), 'tests', 'ressources', 'factice.html');
      };

      await request(serveur).get('/connexion');

      assert.equal(nomPageDemande!, 'connexion');
    });
    
    it("supprime la session de l'utilisateur", async () => {
      let cookieSession = encodeSession({ token: 'token-session' });

      const reponse = await request(serveur)
        .get('/connexion')
        .set('Cookie', [cookieSession]);

      const headerCookie = reponse.headers['set-cookie'];
      assert.notEqual(headerCookie, undefined);
      const cookieSessionDecode = enObjet(headerCookie[0]);
      assert.equal(cookieSessionDecode.session, '');
    });
  });
});
