import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { FournisseurChemin } from '../../src/api/fournisseurChemin.js';
import { creeServeur } from '../../src/api/msc.js';
import { encodeSession, enObjet } from './cookie.js';
import { configurationDeTestDuServeur, fauxFournisseurDeChemin, ressourceFactice } from './fauxObjets.js';

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

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it('renvoie un contenu html', async () => {
      const reponse = await request(serveur).get('/connexion');

      expect(reponse.headers['content-type']).toBeDefined();
      expect(reponse.headers['content-type']).toMatch(/html/);
    });

    it('sers le fichier html de jekyll', async () => {
      let nomPageDemande: string;
      fournisseurChemin.jekyll.page = (nomPage: string) => {
        nomPageDemande = nomPage;
        return ressourceFactice();
      };

      await request(serveur).get('/connexion');

      expect(nomPageDemande!).toBe('connexion');
    });

    it('accepte une URL de redirection vers une page connectée', async () => {
      const reponse = await request(serveur).get('/connexion').query({ urlRedirection: '/favoris?tri=recent' });

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it('refuse une URL de redirection non autorisée', async () => {
      const reponse = await request(serveur).get('/connexion').query({ urlRedirection: 'https://example.com/favoris' });

      expect(reponse.status).toBe(HttpStatusCode.Found);
      expect(reponse.headers.location).toBe('/connexion');
    });

    it("supprime la session de l'utilisateur", async () => {
      const cookieSession = encodeSession({ token: 'token-session' });

      const reponse = await request(serveur).get('/connexion').set('Cookie', [cookieSession]);

      const headerCookie = reponse.headers['set-cookie'];
      expect(headerCookie).toBeDefined();
      const cookieSessionDecode = enObjet(headerCookie[0]);
      expect(cookieSessionDecode.session).toBe('');
    });
  });
});
