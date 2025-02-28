import { beforeEach, describe, it } from 'node:test';
import { Express } from 'express';
import request from 'supertest';
import assert from 'node:assert';
import { ConfigurationServeur } from '../../../src/api/configurationServeur';
import { fabriqueMiddleware } from '../../../src/api/middleware';
import { creeServeur } from '../../../src/api/msc';
import {
  fauxAdaptateurJWT,
  fauxAdaptateurOIDC,
  fauxFournisseurDeChemin,
} from '../fauxObjets';
import { join } from 'node:path';
import { AdaptateurOIDC } from '../../../src/api/oidc/adaptateurOIDC';
import { decodeSessionDuCookie } from '../cookie';
import { AdaptateurJWT } from '../../../src/api/adaptateurJWT';

describe('La ressource apres authentification OIDC', () => {
  describe('quand on fait un GET sur /oidc/apres-authentification', () => {
    let serveur: Express;
    let fournisseurChemin = fauxFournisseurDeChemin;
    let adaptateurOIDC: AdaptateurOIDC;
    let adaptateurJWT: AdaptateurJWT;

    beforeEach(() => {
      adaptateurOIDC = fauxAdaptateurOIDC;
      adaptateurJWT = fauxAdaptateurJWT;
      const configurationServeur: ConfigurationServeur = {
        fournisseurChemin,
        middleware: fabriqueMiddleware(),
        adaptateurOIDC,
        adaptateurJWT,
      };
      serveur = creeServeur(configurationServeur);
    });

    const requeteGet = () =>
      request(serveur).get('/oidc/apres-authentification');

    it('reçoit 200', async () => {
      const reponse = await requeteGet();

      assert.equal(reponse.status, 200);
    });

    it('sert la page apres-authentification', async () => {
      let nomPageDemande;
      fournisseurChemin.cheminPageJekyll = (nomPage) => {
        nomPageDemande = nomPage;
        return join(process.cwd(), 'tests', 'ressources', 'factice.html');
      };

      await requeteGet();

      assert.equal(nomPageDemande, 'apres-authentification');
    });

    it("ajoute les informations de l'utilisateur à la session", async () => {
      adaptateurOIDC.recupereJeton = async () => {
        return { idToken: 'xx', accessToken: 'y' };
      };
      adaptateurOIDC.recupereInformationsUtilisateur = async (accessToken) => {
        if (accessToken === 'y') {
          return {
            prenom: 'Jeanne',
            nom: 'Dupont',
            email: 'jeanne.dupont',
            siret: '1234',
          };
        }
        throw new Error('Aurait du être appelé avec le bon access token');
      };

      const reponse = await requeteGet();

      const session = decodeSessionDuCookie(reponse, 0);
      assert.notEqual(session, undefined);
      assert.equal(session.prenom, 'Jeanne');
      assert.equal(session.nom, 'Dupont');
      assert.equal(session.email, 'jeanne.dupont');
      assert.equal(session.siret, '1234');
    });

    it('ajoute un token JWT à la session', async () => {
      adaptateurJWT.genereToken = (email: string) => `tokenJWT-${email}`;

      const reponse: any = await requeteGet();

      const session = decodeSessionDuCookie(reponse, 0);
      assert.equal(session.token, 'tokenJWT-jeanne.dupont');
    });
  });
});
