import { Express } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../src/api/msc';
import { AdaptateurRechercheEntreprise } from '../../src/infra/adaptateurRechercheEntreprise';
import { Utilisateur } from '../../src/metier/utilisateur';
import { EntrepotUtilisateurMemoire } from '../persistance/entrepotUtilisateurMemoire';
import { encodeSession, enObjet } from './cookie';
import { configurationDeTestDuServeur, fauxAdaptateurJWT } from './fauxObjets';
import { jeanneDupont } from './objetsPretsALEmploi';
import { EntrepotUtilisateur } from '../../src/metier/entrepotUtilisateur';

describe('La ressource Profil', () => {
  let serveur: Express;
  let entrepotUtilisateur: EntrepotUtilisateur;

  beforeEach(() => {
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    entrepotUtilisateur.ajoute(jeanneDupont);
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepotUtilisateur,
    });
  });

  describe('sur demande GET', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/api/profil');

      assert.equal(reponse.status, 200);
    });

    it("renvoie les informations de l'utilisateur", async () => {
      const cookie = encodeSession({
        email: 'jeanne.dupont@user.com',
      });

      const reponse = await request(serveur)
        .get('/api/profil')
        .set('Cookie', [cookie]);

      assert.equal(reponse.body.nom, 'Dupont');
      assert.equal(reponse.body.prenom, 'Jeanne');
      assert.equal(reponse.body.email, 'jeanne.dupont@user.com');
      assert.equal(reponse.body.siret, '13000766900018');
      assert.equal(reponse.body.estAgentAnssi, true);
      assert.equal(reponse.body.idListeFavoris, jeanneDupont.idListeFavoris);
      assert.equal(reponse.body.codeDepartement, '86');
      assert.equal(reponse.body.codeRegion, 'FR-971');
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
        },
        adaptateurRechercheEntreprise
      );
      entrepotUtilisateur.ajoute(jeanMartin);

      const cookie = encodeSession({
        email: 'jean.martin@user.com',
      });

      const reponse = await request(serveur)
        .get('/api/profil')
        .set('Cookie', [cookie]);

      assert.equal(reponse.body.nom, 'Martin');
      assert.equal(reponse.body.prenom, 'Jean');
      assert.equal(reponse.body.email, 'jean.martin@user.com');
      assert.equal(reponse.body.siret, '13000766900018');
      assert.equal(reponse.body.estAgentAnssi, true);
      assert.equal(reponse.body.idListeFavoris, jeanMartin.idListeFavoris);
      assert.equal(reponse.body.codeDepartement, '33');
      assert.equal(reponse.body.codeRegion, 'FR-NAQ');
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
      const reponse = await request(serveur)
        .get('/api/profil')
        .set('Cookie', [cookieSession]);

      const headerCookie = reponse.headers['set-cookie'];
      assert.notEqual(headerCookie, undefined);
      const cookieSessionDecode = enObjet(headerCookie[0]);
      assert.equal(cookieSessionDecode.session, '');
    });
  });
});
