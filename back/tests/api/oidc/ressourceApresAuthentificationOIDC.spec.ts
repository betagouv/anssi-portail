import { beforeEach, describe, it } from 'node:test';
import { Express } from 'express';
import request from 'supertest';
import assert from 'node:assert';
import { ConfigurationServeur } from '../../../src/api/configurationServeur';
import { fabriqueMiddleware } from '../../../src/api/middleware';
import { creeServeur } from '../../../src/api/msc';
import { fauxAdaptateurOIDC, fauxFournisseurDeChemin } from '../fauxObjets';
import { join } from 'node:path';
import { AdaptateurOIDC } from '../../../src/api/oidc/adaptateurOIDC';
import { decodeSessionDuCookie } from '../cookie';

describe('La ressource apres authentification OIDC', () => {
  describe('quand on fait un GET sur /oidc/apres-authentification', () => {
    let serveur: Express;
    let fournisseurChemin = fauxFournisseurDeChemin;
    let adaptateurOIDC: AdaptateurOIDC;

    beforeEach(() => {
      adaptateurOIDC = fauxAdaptateurOIDC;
      const configurationServeur: ConfigurationServeur = {
        fournisseurChemin,
        middleware: fabriqueMiddleware(),
        adaptateurOIDC,
      };
      serveur = creeServeur(configurationServeur);
    });

    it('reçoit 200', async () => {
      const reponse = await request(serveur).get(
        '/oidc/apres-authentification'
      );

      assert.equal(reponse.status, 200);
    });

    it('sert la page apres-authentification', async () => {
      let nomPageDemande;
      fournisseurChemin.cheminPageJekyll = (nomPage) => {
        nomPageDemande = nomPage;
        return join(process.cwd(), 'tests', 'ressources', 'factice.html');
      };
      await request(serveur).get('/oidc/apres-authentification');

      assert.equal(nomPageDemande, 'apres-authentification');
    });

    it('vérifie la récupération de jeton', async () => {
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

      const reponse: any = await request(serveur).get(
        '/oidc/apres-authentification'
      );

      const session = decodeSessionDuCookie(reponse, 0);
      assert.notEqual(session, undefined);
      assert.equal(session.prenom, 'Jeanne');
      assert.equal(session.nom, 'Dupont');
      assert.equal(session.email, 'jeanne.dupont');
      assert.equal(session.siret, '1234');
    });
  });
});
