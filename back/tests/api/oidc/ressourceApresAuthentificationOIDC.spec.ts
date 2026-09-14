import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import { beforeEach, describe, it, expect } from 'vitest';
import request from 'supertest';
import { AdaptateurJWT } from '../../../src/api/adaptateurJWT.js';
import { ConfigurationServeur } from '../../../src/api/configurationServeur.js';
import { creeServeur } from '../../../src/api/msc.js';
import { AdaptateurOIDC } from '../../../src/api/oidc/adaptateurOIDC.js';
import { UtilisateurConnecte } from '../../../src/bus/evenements/utilisateurConnecte.js';
import { MockBusEvenement } from '../../bus/busPourLesTests.js';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire.js';
import { decodeSessionDuCookie } from '../cookie.js';
import {
  configurationDeTestDuServeur,
  fauxAdaptateurEnvironnement,
  fauxAdaptateurJWT,
  fauxAdaptateurOIDC,
  fauxFournisseurDeChemin,
  ressourceFactice,
} from '../fauxObjets.js';
import { utilisateurDeTest } from '../mesures/constructeurDUtilisateur.js';
import { AdaptateurEnvironnement } from '../../../src/infra/adaptateurEnvironnement.js';

describe('La ressource apres authentification OIDC', () => {
  describe('quand on fait un GET sur /oidc/apres-authentification', () => {
    let serveur: Express;
    const fournisseurChemin = fauxFournisseurDeChemin;
    let adaptateurEnvironnement: AdaptateurEnvironnement;
    let adaptateurOIDC: AdaptateurOIDC;
    let adaptateurJWT: AdaptateurJWT;
    let entrepotUtilisateur: EntrepotUtilisateurMemoire;
    let busEvenements: MockBusEvenement;

    beforeEach(() => {
      adaptateurEnvironnement = { ...fauxAdaptateurEnvironnement };
      adaptateurOIDC = { ...fauxAdaptateurOIDC };
      adaptateurJWT = fauxAdaptateurJWT;
      entrepotUtilisateur = new EntrepotUtilisateurMemoire();
      busEvenements = new MockBusEvenement();
      const configurationServeur: ConfigurationServeur = {
        ...configurationDeTestDuServeur,
        adaptateurEnvironnement,
        fournisseurChemin,
        adaptateurOIDC,
        adaptateurJWT,
        entrepotUtilisateur,
        busEvenements,
      };
      serveur = creeServeur(configurationServeur);
    });

    const requeteGet = () =>
      request(serveur).get('/oidc/apres-authentification').set('Cookie', ['AgentConnectInfo={}']);

    const récupèreUnJetonValide = () => {
      adaptateurOIDC.recupereJeton = async () => {
        return {
          idToken: 'tokenAgentConnect',
          accessToken: 'y',
          sujet: 'sujet',
          connexionAvecMFA: true,
          acr: 'eidas2',
        };
      };
    };

    describe("si l'utilisateur est connu", () => {
      const jeanneDupont = utilisateurDeTest()
        .avecLEmail('jeanne.dupont')
        .avecLeNom('Dupont')
        .avecLePrenom('Jeanne')
        .avecLeSiretEntite('1234')
        .construis();

      beforeEach(async () => {
        await entrepotUtilisateur.ajoute(jeanneDupont);

        récupèreUnJetonValide();
        adaptateurOIDC.recupereInformationsUtilisateur = async (_) => ({
          prenom: 'Jeanne',
          nom: 'Dupont',
          email: 'jeanne.dupont',
          siret: '1234',
        });
      });

      it('reçoit 200', async () => {
        const reponse = await requeteGet();

        expect(reponse.status).toBe(HttpStatusCode.Ok);
      });

      it('sert la page apres-authentification', async () => {
        let nomPageDemande;
        fournisseurChemin.jekyll.page = (nomPage) => {
          nomPageDemande = nomPage;
          return ressourceFactice();
        };

        await requeteGet();

        expect(nomPageDemande).toBe('apres-authentification');
      });

      it("ajoute les informations de l'utilisateur à la session", async () => {
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
        expect(session).toBeDefined();
        expect(session.prenom).toBe('Jeanne');
        expect(session.nom).toBe('Dupont');
        expect(session.email).toBe('jeanne.dupont');
        expect(session.siret).toBe('1234');
      });

      it("indique si l'utilisateur utilise le MFA", async () => {
        const reponse = await requeteGet();

        const session = decodeSessionDuCookie(reponse, 0);
        expect(session.connexionAvecMFA).toBe(true);
      });

      it('ajoute un token JWT à la session', async () => {
        adaptateurJWT.genereToken = (donnees: Record<string, unknown>) => `tokenJWT-${donnees.email}`;

        const reponse = await requeteGet();

        const session = decodeSessionDuCookie(reponse, 0);
        expect(session.token).toBe('tokenJWT-jeanne.dupont');
      });

      it('ajoute un tokenId AgentConnect à la session', async () => {
        const reponse = await requeteGet();

        const session = decodeSessionDuCookie(reponse, 0);
        expect(session.AgentConnectIdToken).toBe('tokenAgentConnect');
      });

      it('publie un évènement sur le bus', async () => {
        await requeteGet();

        const evenement = busEvenements.recupereEvenement(UtilisateurConnecte);

        expect(evenement?.emailHache).toBe('jeanne.dupont-hache');
        expect(evenement?.connexionAvecMFA).toBe(true);
      });
    });

    it("jette une erreur d'uthentification trop faible si la connexion ne s'est pas faite en MFA", async () => {
      adaptateurEnvironnement.oidc = () => ({
        ...fauxAdaptateurEnvironnement.oidc(),
        authentificationMultiFacteursDésactivée: () => false,
      });
      adaptateurOIDC.recupereJeton = async () => {
        return {
          idToken: 'tokenAgentConnect',
          accessToken: 'y',
          sujet: 'sujet',
          connexionAvecMFA: false,
          acr: 'eidas1',
        };
      };

      const reponse = await requeteGet();

      expect(reponse.status).toBe(HttpStatusCode.Forbidden);
    });

    it("jette une erreur 401 si le cookie AgentConnectInfo n'est pas défini", async () => {
      const reponse = await requeteGet().set('Cookie', []);

      expect(reponse.status).toBe(HttpStatusCode.Unauthorized);
    });

    it('jette une erreur 401 si quoi que ce soit se passe mal', async () => {
      adaptateurOIDC.recupereJeton = async () => {
        throw new Error('mauvais state');
      };

      const reponse = await requeteGet();

      expect(reponse.status).toBe(HttpStatusCode.Unauthorized);
    });

    describe("si l'utilisateur est inconnu", () => {
      it('ajoute un token contenant les informations du nouvel utilisateur et redirige vers la page de création de compte', async () => {
        récupèreUnJetonValide();

        const reponse = await requeteGet();

        expect(reponse.status).toBe(HttpStatusCode.Found);
        expect(reponse.headers.location).toBe('/creation-compte?token=tokenJWT-');
      });
    });
  });
});
