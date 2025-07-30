import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../src/api/msc';
import { CompteCree } from '../../src/bus/evenements/compteCree';
import { AdaptateurRechercheEntreprise } from '../../src/infra/adaptateurRechercheEntreprise';
import {
  fabriqueBusPourLesTests,
  MockBusEvenement,
} from '../bus/busPourLesTests';
import { EntrepotUtilisateurMemoire } from '../persistance/entrepotUtilisateurMemoire';
import { configurationDeTestDuServeur } from './fauxObjets';
import { AdaptateurJWT } from '../../src/api/adaptateurJWT';

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
      const reponse = await request(serveur)
        .post('/api/utilisateurs')
        .send(donneesUtilisateur);

      assert.equal(reponse.status, 201);
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
        },
      ];

      await request(serveur).post('/api/utilisateurs').send(donneesUtilisateur);

      const jeanne = await entrepotUtilisateur.parEmailHache(
        'jeanne.dupont@user.com-hache'
      );
      assert.notEqual(jeanne, undefined);
      assert.equal(jeanne?.email, 'jeanne.dupont@user.com');
      assert.equal(jeanne?.prenom, 'Jeanne');
      assert.equal(jeanne?.nom, 'Dupont');
      assert.equal(jeanne?.telephone, '0123456789');
      assert.deepEqual(jeanne?.domainesSpecialite, ['RSSI']);
      assert.equal((await jeanne?.organisation())?.siret, '13000766900018');
      assert.equal(jeanne?.cguAcceptees, true);
      assert.equal(jeanne?.infolettreAcceptee, true);
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

      const jeanne = await entrepotUtilisateur.parEmailHache(
        'jeanne.dupont@user.com-hache'
      );

      assert.equal((await jeanne?.organisation())?.siret, '11223344556677');
    });

    it('publie un événement de création de compte', async () => {
      await request(serveur).post('/api/utilisateurs').send(donneesUtilisateur);

      busEvenements.aRecuUnEvenement(CompteCree);
      const evenement = busEvenements.recupereEvenement(CompteCree);
      assert.equal(evenement!.email, 'jeanne.dupont@user.com');
      assert.equal(evenement!.prenom, 'Jeanne');
      assert.equal(evenement!.nom, 'Dupont');
      assert.equal(evenement!.infoLettre, true);
    });

    it('aseptise les paramètres', async () => {
      adaptateurRechercheEntreprise.rechercheOrganisations = async () => [
        {
          nom: '',
          departement: '',
          siret: '13000766900018',
          codeTrancheEffectif: '01',
          codeRegion: 'FR-ARA',
          codeSecteur: 'D',
        },
      ];

      await request(serveur)
        .post('/api/utilisateurs')
        .send({
          email: '  jeanne.dupont@user.com',
          prenom: '<Jeanne',
          nom: '<Dupont',
          telephone: ' 0123456789',
          domainesSpecialite: [' RSSI'],
          siretEntite: ' 13000766900018',
          cguAcceptees: true,
          infolettreAcceptee: true,
          token: donneesUtilisateur.token,
        });

      const jeanne = await entrepotUtilisateur.parEmailHache(
        'jeanne.dupont@user.com-hache'
      );
      assert.notEqual(jeanne, undefined);
      assert.equal(jeanne?.telephone, '0123456789');
      assert.deepEqual(jeanne?.domainesSpecialite, ['RSSI']);
      assert.equal((await jeanne?.organisation())?.siret, '13000766900018');
    });

    describe('concernant la validation des données', () => {
      it('valide le téléphone', async () => {
        const reponse = await request(serveur)
          .post('/api/utilisateurs')
          .send({
            ...donneesUtilisateur,
            telephone: 'ABCD',
          });
        assert.equal(reponse.status, 400);
        assert.equal(reponse.body.erreur, 'Le téléphone est invalide');
      });

      it('valide les domaines de spécialité', async () => {
        const reponse = await request(serveur)
          .post('/api/utilisateurs')
          .send({
            ...donneesUtilisateur,
            domainesSpecialite: [],
          });
        assert.equal(reponse.status, 400);
        assert.equal(
          reponse.body.erreur,
          'Les domaines de spécialité sont invalides'
        );
      });

      it('valide le siret', async () => {
        const reponse = await request(serveur)
          .post('/api/utilisateurs')
          .send({
            ...donneesUtilisateur,
            siretEntite: 'unMauvaisSiret',
          });
        assert.equal(reponse.status, 400);
        assert.equal(reponse.body.erreur, 'Le siret est invalide');
      });

      it("valide l'acceptation des CGU", async () => {
        const reponse = await request(serveur)
          .post('/api/utilisateurs')
          .send({
            ...donneesUtilisateur,
            cguAcceptees: 12,
          });
        assert.equal(reponse.status, 400);
        assert.equal(reponse.body.erreur, "L'acceptation des CGU est invalide");
      });

      it("valide l'acceptation de l'infolettre", async () => {
        const reponse = await request(serveur)
          .post('/api/utilisateurs')
          .send({
            ...donneesUtilisateur,
            infolettreAcceptee: 12,
          });
        assert.equal(reponse.status, 400);
        assert.equal(
          reponse.body.erreur,
          "L'acceptation de l'infolettre est invalide"
        );
      });

      describe('valide le token', () => {
        it("lorsqu'il est vide", async () => {
          const reponse = await request(serveur)
            .post('/api/utilisateurs')
            .send({
              ...donneesUtilisateur,
              token: '',
            });
          assert.equal(reponse.status, 400);
          assert.equal(reponse.body.erreur, 'Le token est invalide');
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
          assert.equal(reponse.status, 400);
          assert.equal(reponse.body.erreur, 'Le token est invalide');
        });
      });
    });
  });
});
