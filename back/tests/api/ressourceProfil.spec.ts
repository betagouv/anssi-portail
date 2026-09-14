import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { beforeEach, describe, it, expect } from 'vitest';
import request from 'supertest';
import { creeServeur } from '../../src/api/msc.js';
import { AdaptateurRechercheEntreprise } from '../../src/infra/adaptateurRechercheEntreprise.js';
import { EntrepotUtilisateur } from '../../src/metier/entrepotUtilisateur.js';
import { Utilisateur } from '../../src/metier/utilisateur.js';
import { EntrepotUtilisateurMemoire } from '../persistance/entrepotUtilisateurMemoire.js';
import { encodeSession, enObjet } from './cookie.js';
import { configurationDeTestDuServeur, fauxAdaptateurHachage, fauxAdaptateurJWT } from './fauxObjets.js';
import { hectorDurant, jeanneDupont } from './objetsPretsALEmploi.js';
import { ConstructeurDUtilisateur } from './mesures/constructeurDUtilisateur.js';

const { JsonWebTokenError } = jsonwebtoken;

describe('La ressource Profil', () => {
  let serveur: Express;
  let entrepotUtilisateur: EntrepotUtilisateur;

  beforeEach(async () => {
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    await entrepotUtilisateur.ajoute(jeanneDupont);
    await entrepotUtilisateur.ajoute(hectorDurant);
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepotUtilisateur,
    });
  });

  describe('sur demande GET', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/api/profil');

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it("renvoie les informations de l'utilisateur", async () => {
      const cookie = encodeSession({
        email: 'jeanne.dupont@user.com',
        token: 'valide',
      });

      const reponse = await request(serveur).get('/api/profil').set('Cookie', [cookie]);

      expect(reponse.body.nom).toBe('Dupont');
      expect(reponse.body.prenom).toBe('Jeanne');
      expect(reponse.body.email).toBe('jeanne.dupont@user.com');
      expect(reponse.body.siret).toBe('13000766900018');
      expect(reponse.body.estAgentAnssi).toBe(true);
      expect(reponse.body.idListeFavoris).toBe(jeanneDupont.idListeFavoris);
      expect(reponse.body.codeDepartement).toBe('86');
      expect(reponse.body.codeRegion).toBe('FR-971');
    });

    it("déduit la région du département si elle n'est valorisée", async () => {
      const adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise = {
        rechercheOrganisations: async (siret: string) => [
          {
            siret,
            nom: '',
            departement: '33',
            codeSecteur: 'A',
            codeRegion: undefined,
            codeTrancheEffectif: '11',
            estAssociation: false,
            estCollectivite: false,
            codeActivite: '1234',
          },
        ],
      };
      const jeanMartin = new Utilisateur(
        {
          email: 'jean.martin@user.com',
          prenom: 'Jean',
          nom: 'Martin',
          telephone: '0123456789',
          domainesSpecialite: ['RSSI'],
          siretEntite: '13000766900018',
          cguAcceptees: true,
          infolettreAcceptee: true,
          pixelDeSuiviAccepté: true,
        },
        adaptateurRechercheEntreprise,
        fauxAdaptateurHachage
      );
      entrepotUtilisateur.ajoute(jeanMartin);

      const cookie = encodeSession({
        email: 'jean.martin@user.com',
        token: 'valide',
      });

      const reponse = await request(serveur).get('/api/profil').set('Cookie', [cookie]);

      expect(reponse.body.nom).toBe('Martin');
      expect(reponse.body.prenom).toBe('Jean');
      expect(reponse.body.email).toBe('jean.martin@user.com');
      expect(reponse.body.siret).toBe('13000766900018');
      expect(reponse.body.estAgentAnssi).toBe(true);
      expect(reponse.body.idListeFavoris).toBe(jeanMartin.idListeFavoris);
      expect(reponse.body.codeDepartement).toBe('33');
      expect(reponse.body.codeRegion).toBe('FR-NAQ');
    });

    it('supprime la session si le token JWT est invalide', async () => {
      const cookieSession = encodeSession({ token: 'token-session' });

      serveur = creeServeur({
        ...configurationDeTestDuServeur,
        adaptateurJWT: {
          ...fauxAdaptateurJWT,
          decode(_: string) {
            throw new JsonWebTokenError('mauvais token');
          },
        },
      });
      const reponse = await request(serveur).get('/api/profil').set('Cookie', [cookieSession]);

      const headerCookie = reponse.headers['set-cookie'];
      expect(headerCookie).toBeDefined();
      const cookieSessionDecode = enObjet(headerCookie[0]);
      expect(cookieSessionDecode.session).toBe('');
    });

    it("renvoie le code d'activité de l'organisation", async () => {
      const cookie = encodeSession({
        email: 'jeanne.dupont@user.com',
        token: 'valide',
      });

      const reponse = await request(serveur).get('/api/profil').set('Cookie', [cookie]);

      expect(reponse.body.codeActivite).toBe('84.11Z');
    });

    describe("concernant la capacité de l'utilisateur à éditer les guides", () => {
      it('est vraie si il a le MFA et le rôle correspondant', async () => {
        const cookie = encodeSession({
          email: 'jeanne.dupont@user.com',
          token: 'valide',
          connexionAvecMFA: true,
        });

        const reponse = await request(serveur).get('/api/profil').set('Cookie', [cookie]);

        expect(reponse.body.peutGererLesGuides).toBe(true);
      });

      it("est fausse si il n'a pas le MFA", async () => {
        const cookie = encodeSession({
          email: 'jeanne.dupont@user.com',
          connexionAvecMFA: false,
        });

        const reponse = await request(serveur).get('/api/profil').set('Cookie', [cookie]);

        expect(reponse.body.peutGererLesGuides).toBe(false);
      });

      it("est fausse si il n'a pas le rôle nécessaire", async () => {
        const cookie = encodeSession({
          email: hectorDurant.email,
          token: 'valide',
          connexionAvecMFA: true,
        });

        const reponse = await request(serveur).get('/api/profil').set('Cookie', [cookie]);

        expect(reponse.body.peutGererLesGuides).toBe(false);
      });

      it("est fausse si il n'y a pas d'utilisateur connecté", async () => {
        const cookie = encodeSession({
          email: 'email inconnu',
          token: 'valide',
          connexionAvecMFA: true,
        });

        const reponse = await request(serveur).get('/api/profil').set('Cookie', [cookie]);

        expect(reponse.body.peutGererLesGuides).toBe(false);
      });
    });
    describe('concernant le parcours de sécurisation', () => {
      it("ne renvoie pas de parcours si l'utilisateur n'est pas connecté", async () => {
        const reponse = await request(serveur).get('/api/profil');

        expect(reponse.statusCode).toBe(HttpStatusCode.Ok);
        expect(reponse.body.parcoursSecurisation).toBeUndefined();
      });

      it('renvoie le parcours actuel', async () => {
        const utilisateur = new ConstructeurDUtilisateur()
          .avecLEmail('chuck@user.com')
          .avecLeParcours('complet')
          .construis();

        await entrepotUtilisateur.ajoute(utilisateur);
        const cookie = encodeSession({
          email: 'chuck@user.com',
          token: 'valide',
        });

        const reponse = await request(serveur).get('/api/profil').set('Cookie', [cookie]);

        expect(reponse.body.parcoursSecurisation).toEqual({ parcoursActuel: 'complet' });
      });
    });
  });
});
