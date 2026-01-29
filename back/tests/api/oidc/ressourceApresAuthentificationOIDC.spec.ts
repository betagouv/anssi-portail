import { beforeEach, describe, it } from 'node:test';
import { Express } from 'express';
import request from 'supertest';
import assert from 'node:assert';
import { ConfigurationServeur } from '../../../src/api/configurationServeur';
import { creeServeur } from '../../../src/api/msc';
import {
  configurationDeTestDuServeur,
  fauxAdaptateurJWT,
  fauxAdaptateurOIDC,
  fauxAdaptateurRechercheEntreprise,
  fauxFournisseurDeChemin,
} from '../fauxObjets';
import { join } from 'node:path';
import { AdaptateurOIDC } from '../../../src/api/oidc/adaptateurOIDC';
import { decodeSessionDuCookie } from '../cookie';
import { AdaptateurJWT } from '../../../src/api/adaptateurJWT';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire';
import { Utilisateur } from '../../../src/metier/utilisateur';
import { MockBusEvenement } from '../../bus/busPourLesTests';
import { UtilisateurConnecte } from '../../../src/bus/evenements/utilisateurConnecte';

describe('La ressource apres authentification OIDC', () => {
  describe('quand on fait un GET sur /oidc/apres-authentification', () => {
    let serveur: Express;
    const fournisseurChemin = fauxFournisseurDeChemin;
    let adaptateurOIDC: AdaptateurOIDC;
    let adaptateurJWT: AdaptateurJWT;
    let entrepotUtilisateur: EntrepotUtilisateurMemoire;
    let busEvenements: MockBusEvenement;

    beforeEach(() => {
      adaptateurOIDC = { ...fauxAdaptateurOIDC };
      adaptateurJWT = fauxAdaptateurJWT;
      entrepotUtilisateur = new EntrepotUtilisateurMemoire();
      busEvenements = new MockBusEvenement();
      const configurationServeur: ConfigurationServeur = {
        ...configurationDeTestDuServeur,
        fournisseurChemin,
        adaptateurOIDC,
        adaptateurJWT,
        entrepotUtilisateur,
        busEvenements,
      };
      serveur = creeServeur(configurationServeur);
    });

    const requeteGet = () =>
      request(serveur)
        .get('/oidc/apres-authentification')
        .set('Cookie', ['AgentConnectInfo={}']);

    describe("si l'utilisateur est connu", () => {
      beforeEach(() => {
        const jeanneDupont = new Utilisateur(
          {
            email: 'jeanne.dupont',
            cguAcceptees: true,
            infolettreAcceptee: true,
            prenom: '',
            nom: '',
            siretEntite: '',
            domainesSpecialite: [],
          },
          fauxAdaptateurRechercheEntreprise
        );
        entrepotUtilisateur.ajoute(jeanneDupont);

        adaptateurOIDC.recupereInformationsUtilisateur = async (_) => ({
          prenom: 'Jeanne',
          nom: 'Dupont',
          email: 'jeanne.dupont',
          siret: '1234',
        });
      });

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
          return { idToken: 'xx', accessToken: 'y', connexionAvecMFA: false };
        };
        adaptateurOIDC.recupereInformationsUtilisateur = async (
          accessToken
        ) => {
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
        adaptateurJWT.genereToken = (donnees: Record<string, unknown>) =>
          `tokenJWT-${donnees.email}`;

        const reponse = await requeteGet();

        const session = decodeSessionDuCookie(reponse, 0);
        assert.equal(session.token, 'tokenJWT-jeanne.dupont');
      });

      it('ajoute un tokenId AgentConnect à la session', async () => {
        adaptateurOIDC.recupereJeton = async () => {
          return {
            idToken: 'tokenAgentConnect',
            accessToken: 'y',
            connexionAvecMFA: false,
          };
        };

        const reponse = await requeteGet();

        const session = decodeSessionDuCookie(reponse, 0);
        assert.equal(session.AgentConnectIdToken, 'tokenAgentConnect');
      });

      it('publie un évènement sur le bus', async () => {
        adaptateurOIDC.recupereJeton = async () => {
          return {
            idToken: 'tokenAgentConnect',
            accessToken: 'y',
            connexionAvecMFA: true,
          };
        };
        await requeteGet();

        const evenement = busEvenements.recupereEvenement(UtilisateurConnecte);

        assert.equal(evenement?.emailHache, 'jeanne.dupont-hache');
        assert.equal(evenement?.connexionAvecMFA, true);
      });
    });

    it("jette une erreur 401 si le cookie AgentConnectInfo n'est pas défini", async () => {
      const reponse = await requeteGet().set('Cookie', []);

      assert.equal(reponse.status, 401);
    });

    it('jette une erreur 401 si quoi que ce soit se passe mal', async () => {
      adaptateurOIDC.recupereJeton = async () => {
        throw new Error('mauvais state');
      };

      const reponse = await requeteGet();

      assert.equal(reponse.status, 401);
    });

    describe("si l'utilisateur est inconnu", () => {
      it('ajoute un token contenant les informations du nouvel utilisateur et redirige vers la page de création de compte', async () => {
        const reponse = await requeteGet();

        assert.equal(reponse.status, 302);
        assert.equal(
          reponse.headers.location,
          '/creation-compte?token=tokenJWT-'
        );
      });
    });
  });
});
