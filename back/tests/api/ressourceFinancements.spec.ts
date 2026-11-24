import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../src/api/msc/index.js';
import { AdaptateurRechercheEntreprise } from '../../src/infra/adaptateurRechercheEntreprise.js';
import { EntrepotFinancementMemoire } from '../persistance/entrepotFinancementMemoire.js';
import { EntrepotUtilisateurMemoire } from '../persistance/entrepotUtilisateurMemoire.js';
import { encodeSession } from './cookie.js';
import { configurationDeTestDuServeur, fauxAdaptateurRechercheEntreprise } from './fauxObjets.js';
import { financementCyberPME, jeanneDupont } from './objetsPretsALEmploi.js';

describe('La ressource Financements', () => {
  let serveur: Express;
  let entrepotFinancement: EntrepotFinancementMemoire;
  let adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise;
  const cookieJeanneDupont = encodeSession({
    email: jeanneDupont.email,
    token: 'token',
  });
  beforeEach(async () => {
    adaptateurRechercheEntreprise = {
      ...fauxAdaptateurRechercheEntreprise,
    };
    entrepotFinancement = new EntrepotFinancementMemoire();
    const entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    await entrepotUtilisateur.ajoute(jeanneDupont);
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepotUtilisateur,
      adaptateurRechercheEntreprise,
      entrepotFinancement,
    });
  });
  describe('sur demande GET', () => {
    it('renvoie un 200', async () => {
      const reponse = await request(serveur).get('/api/financements');

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it('renvoie une liste de financements', async () => {
      await entrepotFinancement.ajoute(financementCyberPME);

      const reponse = await request(serveur).get('/api/financements');

      expect(reponse.body).toEqual([
        {
          id: 1,
          nom: 'Cyber PME',
          financeur: 'BPI France',
          typesDeFinancement: ['Formation'],
          entitésÉligibles: ['PME', 'ETI'],
          périmètresGéographiques: ['France'],
          régions: ['FRANCE'],
        },
      ]);
    });

    it("renvoie un 500 si l'entrepot renvoie une erreur", async () => {
      entrepotFinancement.tous = () => {
        throw new Error('Erreur technique');
      };
      const reponse = await request(serveur).get('/api/financements');

      expect(reponse.status).toBe(HttpStatusCode.InternalServerError);
    });
    describe('pour un utilisateur connecté', () => {
      const listeDeFinancementsAttendus = [
        {
          id: 1,
          nom: 'Cyber PME',
          financeur: 'BPI France',
          typesDeFinancement: ['Formation'],
          entitésÉligibles: ['PME', 'ETI'],
          périmètresGéographiques: ['France'],
          régions: ['FRANCE'],
        },
      ];
      const resultatRechercheEntreprise = {
        departement: 'Nord',
        nom: 'Friterie',
        siret: '13000766900018',
        codeTrancheEffectif: '21',
        codeSecteur: 'U',
        codeRegion: 'FR-HDF',
        estAssociation: false,
        estCollectivite: false,
        codeActivite: '62.01Z',
      };
      beforeEach(async () => {
        await entrepotFinancement.ajoute(financementCyberPME);
      });

      it("renvoie une liste de financements préfiltrés sur la région de l'organisation de l'utilisateur", async () => {
        adaptateurRechercheEntreprise.rechercheOrganisation = async () => resultatRechercheEntreprise;

        await entrepotFinancement.ajoute({
          ...financementCyberPME,
          id: 2,
          régions: ['FR-IDF'],
        });

        const reponse = await request(serveur).get('/api/financements').set('Cookie', [cookieJeanneDupont]).send();

        expect(reponse.body).toEqual(listeDeFinancementsAttendus);
      });

      it('renvoie une liste de financements concernant les TPE uniquement', async () => {
        adaptateurRechercheEntreprise.rechercheOrganisation = async () => ({
          ...resultatRechercheEntreprise,
          codeTrancheEffectif: '11',
        });

        await entrepotFinancement.ajoute({
          ...financementCyberPME,
          id: 2,
          entitésÉligibles: ['TPE'],
        });

        const reponse = await request(serveur).get('/api/financements').set('Cookie', [cookieJeanneDupont]).send();

        expect(reponse.body).toEqual([
          {
            id: 2,
            nom: 'Cyber PME',
            financeur: 'BPI France',
            typesDeFinancement: ['Formation'],
            entitésÉligibles: ['TPE'],
            périmètresGéographiques: ['France'],
            régions: ['FRANCE'],
          },
        ]);
      });

      it('renvoie une liste de financements concernant les PME uniquement', async () => {
        adaptateurRechercheEntreprise.rechercheOrganisation = async () => ({
          ...resultatRechercheEntreprise,
          codeTrancheEffectif: '12',
        });

        await entrepotFinancement.ajoute({
          ...financementCyberPME,
          id: 2,
          entitésÉligibles: ['TPE'],
        });

        const reponse = await request(serveur).get('/api/financements').set('Cookie', [cookieJeanneDupont]).send();

        expect(reponse.body).toEqual(listeDeFinancementsAttendus);
      });

      it('renvoie une liste de financements concernant les ETI uniquement', async () => {
        adaptateurRechercheEntreprise.rechercheOrganisation = async () => ({
          ...resultatRechercheEntreprise,
          codeTrancheEffectif: '32',
        });

        await entrepotFinancement.ajoute({
          ...financementCyberPME,
          id: 2,
          entitésÉligibles: ['TPE'],
        });

        const reponse = await request(serveur).get('/api/financements').set('Cookie', [cookieJeanneDupont]).send();

        expect(reponse.body).toEqual(listeDeFinancementsAttendus);
      });

      it('renvoie une liste de financements concernant les Entreprises uniquement', async () => {
        adaptateurRechercheEntreprise.rechercheOrganisation = async () => ({
          ...resultatRechercheEntreprise,
          codeTrancheEffectif: '52',
        });
        await entrepotFinancement.ajoute({
          ...financementCyberPME,
          id: 2,
          entitésÉligibles: ['Entreprises'],
        });

        const reponse = await request(serveur).get('/api/financements').set('Cookie', [cookieJeanneDupont]).send();

        expect(reponse.body).toEqual([
          {
            id: 2,
            nom: 'Cyber PME',
            financeur: 'BPI France',
            typesDeFinancement: ['Formation'],
            entitésÉligibles: ['Entreprises'],
            périmètresGéographiques: ['France'],
            régions: ['FRANCE'],
          },
        ]);
      });

      it('renvoie une liste de financements concernant les collectivités uniquement', async () => {
        adaptateurRechercheEntreprise.rechercheOrganisation = async () => ({
          ...resultatRechercheEntreprise,
          estCollectivite: true,
        });

        await entrepotFinancement.ajoute({
          ...financementCyberPME,
          id: 2,
          entitésÉligibles: ['Collectivités'],
        });

        const reponse = await request(serveur).get('/api/financements').set('Cookie', [cookieJeanneDupont]).send();

        expect(reponse.body).toEqual([
          {
            id: 2,
            nom: 'Cyber PME',
            financeur: 'BPI France',
            typesDeFinancement: ['Formation'],
            entitésÉligibles: ['Collectivités'],
            périmètresGéographiques: ['France'],
            régions: ['FRANCE'],
          },
        ]);
      });

      it('renvoie une liste de financements concernant les associations uniquement', async () => {
        adaptateurRechercheEntreprise.rechercheOrganisation = async () => ({
          ...resultatRechercheEntreprise,
          estAssociation: true,
        });

        await entrepotFinancement.ajoute({
          ...financementCyberPME,
          id: 2,
          entitésÉligibles: ['Associations'],
        });

        const reponse = await request(serveur).get('/api/financements').set('Cookie', [cookieJeanneDupont]).send();

        expect(reponse.body).toEqual([
          {
            id: 2,
            nom: 'Cyber PME',
            financeur: 'BPI France',
            typesDeFinancement: ['Formation'],
            entitésÉligibles: ['Associations'],
            périmètresGéographiques: ['France'],
            régions: ['FRANCE'],
          },
        ]);
      });
    });
  });
});
