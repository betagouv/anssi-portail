import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { AdaptateurJWT } from '../../src/api/adaptateurJWT.js';
import { creeServeur } from '../../src/api/msc.js';
import { CompteCree } from '../../src/bus/evenements/compteCree.js';
import { AdaptateurRechercheEntreprise } from '../../src/infra/adaptateurRechercheEntreprise.js';
import { fabriqueBusPourLesTests, MockBusEvenement } from '../bus/busPourLesTests.js';
import { EntrepotUtilisateurMemoire } from '../persistance/entrepotUtilisateurMemoire.js';
import { configurationDeTestDuServeur } from './fauxObjets.js';

describe('La ressource utilisateur', () => {
  let serveur: Express;
  let entrepotUtilisateur: EntrepotUtilisateurMemoire;
  let adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise;
  let adaptateurJWT: AdaptateurJWT;
  const donneesUtilisateur = {
    telephone: '0123456789',
    domainesSpecialite: ['RSSI'],
    siretEntite: '13000766900018',
    cguAcceptees: true,
    infolettreAcceptee: true,
    pixelDeSuiviAccepté: true,
    token:
      JSON.stringify({
        email: 'jeanne.dupont@user.com',
        prenom: 'Jeanne',
        nom: 'Dupont',
      }) + '-code',
  };
  let busEvenements: MockBusEvenement;

  beforeEach(() => {
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    busEvenements = fabriqueBusPourLesTests();
    adaptateurRechercheEntreprise = {
      rechercheOrganisations: async (_: string, __: string | null) => [],
    };
    adaptateurJWT = {
      decode: (token) => JSON.parse(token.slice(0, -5)),
      genereToken: () => '',
    };

    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepotUtilisateur,
      busEvenements,
      adaptateurRechercheEntreprise,
      adaptateurJWT,
    });
  });

  describe('sur demande POST', () => {
    it('répond 201', async () => {
      const reponse = await request(serveur).post('/api/utilisateurs').send(donneesUtilisateur);

      expect(reponse.status).toBe(HttpStatusCode.Created);
    });

    it("ajoute un utilisateur à l'entrepot", async () => {
      adaptateurRechercheEntreprise.rechercheOrganisations = async () => [
        {
          nom: '',
          departement: '',
          siret: '13000766900018',
          codeTrancheEffectif: '01',
          codeRegion: 'FR-ARA',
          codeSecteur: 'D',
          estAssociation: false,
          estCollectivite: false,
          codeActivite: '62.01Z',
        },
      ];

      await request(serveur).post('/api/utilisateurs').send(donneesUtilisateur);

      const jeanne = await entrepotUtilisateur.parEmailHache('jeanne.dupont@user.com-hache');
      expect(jeanne).toBeDefined();
      expect(jeanne?.email).toBe('jeanne.dupont@user.com');
      expect(jeanne?.prenom).toBe('Jeanne');
      expect(jeanne?.nom).toBe('Dupont');
      expect(jeanne?.telephone).toBe('0123456789');
      expect(jeanne?.domainesSpecialite).toEqual(['RSSI']);
      expect((await jeanne?.organisation())?.siret).toBe('13000766900018');
      expect(jeanne?.cguAcceptees).toBe(true);
      expect(jeanne?.infolettreAcceptee).toBe(true);
      expect(jeanne?.pixelDeSuiviAccepté).toBe(true);
    });

    it('utilise le SIRET du token en priorité', async () => {
      adaptateurRechercheEntreprise.rechercheOrganisations = async (siret) => [
        {
          nom: '',
          departement: '',
          siret,
          codeTrancheEffectif: '01',
          codeRegion: 'FR-ARA',
          codeSecteur: 'D',
          estAssociation: false,
          estCollectivite: false,
          codeActivite: '62.01Z',
        },
      ];

      await request(serveur)
        .post('/api/utilisateurs')
        .send({
          ...donneesUtilisateur,
          token:
            JSON.stringify({
              email: 'jeanne.dupont@user.com',
              prenom: 'Jeanne',
              nom: 'Dupont',
              siret: '11223344556677',
            }) + '-code',
        });

      const jeanne = await entrepotUtilisateur.parEmailHache('jeanne.dupont@user.com-hache');

      expect((await jeanne?.organisation())?.siret).toBe('11223344556677');
    });

    it('publie un événement de création de compte', async () => {
      await request(serveur).post('/api/utilisateurs').send(donneesUtilisateur);

      busEvenements.aRecuUnEvenement(CompteCree);
      const evenement = busEvenements.recupereEvenement(CompteCree);
      expect(evenement!.email).toBe('jeanne.dupont@user.com');
      expect(evenement!.prenom).toBe('Jeanne');
      expect(evenement!.nom).toBe('Dupont');
      expect(evenement!.infoLettre).toBe(true);
      expect(evenement!.pixelDeSuiviAccepté).toBe(true);
      expect(evenement!.telephone).toBe('0123456789');
      expect(evenement!.suivi).toBeUndefined();
    });

    it('publie un événement de création de compte avec une campagne', async () => {
      await request(serveur).post('/api/utilisateurs').query({ campagne: 'aout_2026' }).send(donneesUtilisateur);

      busEvenements.aRecuUnEvenement(CompteCree);
      const evenement = busEvenements.recupereEvenement(CompteCree);

      expect(evenement!.suivi?.campagne).toBe('aout_2026');
    });

    it('publie un événement de création de compte avec le parcours complet en destination', async () => {
      await request(serveur)
        .post('/api/utilisateurs')
        .query({ redirectUrl: 'http://mondomaine/parcours-complet' })
        .send(donneesUtilisateur);

      const evenement = busEvenements.recupereEvenement(CompteCree);

      expect(evenement!.suivi?.parcoursDestination).toBe('complet');
    });

    it('publie un événement de création de compte avec le parcours basique en destination', async () => {
      await request(serveur)
        .post('/api/utilisateurs')
        .query({ redirectUrl: 'http://mondomaine/modules/1' })
        .send(donneesUtilisateur);

      const evenement = busEvenements.recupereEvenement(CompteCree);

      expect(evenement!.suivi?.parcoursDestination).toBe('allégé');
    });

    it('publie un événement de création de compte avec la source', async () => {
      await request(serveur)
        .post('/api/utilisateurs')
        .query({ pageSource: '/parcours-securisation-hero' })
        .send(donneesUtilisateur);

      const evenement = busEvenements.recupereEvenement(CompteCree);

      expect(evenement!.suivi?.source).toBe('/parcours-securisation-hero');
    });

    describe('concernant la validation des données', () => {
      it('valide le téléphone', async () => {
        const reponse = await request(serveur)
          .post('/api/utilisateurs')
          .send({
            ...donneesUtilisateur,
            telephone: 'ABCD',
          });
        expect(reponse.status).toBe(HttpStatusCode.BadRequest);
        expect(reponse.body.fieldErrors.telephone[0]).toBe('Le téléphone est invalide');
      });

      it('valide les domaines de spécialité', async () => {
        const reponse = await request(serveur)
          .post('/api/utilisateurs')
          .send({
            ...donneesUtilisateur,
            domainesSpecialite: [],
          });
        expect(reponse.status).toBe(HttpStatusCode.BadRequest);
        expect(reponse.body.fieldErrors.domainesSpecialite[0]).toBe('Les domaines de spécialité sont invalides');
      });

      it('valide le siret', async () => {
        const reponse = await request(serveur)
          .post('/api/utilisateurs')
          .send({
            ...donneesUtilisateur,
            siretEntite: 'unMauvaisSiret',
          });
        expect(reponse.status).toBe(HttpStatusCode.BadRequest);
        expect(reponse.body.fieldErrors.siretEntite[0]).toBe('Le siret est invalide');
      });

      it("valide l'acceptation des CGU", async () => {
        const reponse = await request(serveur)
          .post('/api/utilisateurs')
          .send({
            ...donneesUtilisateur,
            cguAcceptees: 12,
          });
        expect(reponse.status).toBe(HttpStatusCode.BadRequest);
        expect(reponse.body.fieldErrors.cguAcceptees[0]).toBe("L'acceptation des CGU est invalide");
      });

      it("valide l'acceptation de l'infolettre", async () => {
        const reponse = await request(serveur)
          .post('/api/utilisateurs')
          .send({
            ...donneesUtilisateur,
            infolettreAcceptee: 12,
          });
        expect(reponse.status).toBe(HttpStatusCode.BadRequest);
        expect(reponse.body.fieldErrors.infolettreAcceptee[0]).toBe("L'acceptation de l'infolettre est invalide");
      });

      describe('valide le token', () => {
        it("lorsqu'il est vide", async () => {
          const reponse = await request(serveur)
            .post('/api/utilisateurs')
            .send({
              ...donneesUtilisateur,
              token: '',
            });
          expect(reponse.status).toBe(HttpStatusCode.BadRequest);
          expect(reponse.body.fieldErrors.token[0]).toBe('Le token est invalide');
        });

        it("lorsqu'il est mal signé", async () => {
          adaptateurJWT.decode = () => {
            throw new Error('Le token est invalide');
          };
          const reponse = await request(serveur)
            .post('/api/utilisateurs')
            .send({
              ...donneesUtilisateur,
              token: 'azertyui',
            });
          expect(reponse.status).toBe(HttpStatusCode.BadRequest);
          expect(reponse.body.erreur).toBe('Le token est invalide');
        });
      });
    });
  });
});
