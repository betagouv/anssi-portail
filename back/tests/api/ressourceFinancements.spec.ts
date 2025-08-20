import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../src/api/msc';
import { AdaptateurRechercheEntreprise } from '../../src/infra/adaptateurRechercheEntreprise';
import { EntrepotFinancementMemoire } from '../persistance/entrepotFinancementMemoire';
import { EntrepotUtilisateurMemoire } from '../persistance/entrepotUtilisateurMemoire';
import { encodeSession } from './cookie';
import {
  configurationDeTestDuServeur,
  fauxAdaptateurRechercheEntreprise,
} from './fauxObjets';
import { financementCyberPME, jeanneDupont } from './objetsPretsALEmploi';

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

      assert.equal(reponse.status, 200);
    });

    it('renvoie une liste de financements', async () => {
      await entrepotFinancement.ajoute(financementCyberPME);

      const reponse = await request(serveur).get('/api/financements');

      assert.deepEqual(reponse.body, [
        {
          id: 1,
          nom: 'Cyber PME',
          financeur: 'BPI France',
          typesDeFinancement: ['Formation'],
          entitesElligibles: ['PME', 'ETI'],
          perimetresGeographiques: ['France'],
          regions: ['FRANCE'],
        },
      ]);
    });

    it("renvoie un 500 si l'entrepot renvoie une erreur", async () => {
      entrepotFinancement.tous = () => {
        throw new Error('Erreur technique');
      };
      const reponse = await request(serveur).get('/api/financements');

      assert.equal(reponse.status, 500);
    });
    describe('pour un utilisateur connecté', () => {
      const listeDeFinancementsAttendus = [
        {
          id: 1,
          nom: 'Cyber PME',
          financeur: 'BPI France',
          typesDeFinancement: ['Formation'],
          entitesElligibles: ['PME', 'ETI'],
          perimetresGeographiques: ['France'],
          regions: ['FRANCE'],
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
      };
      beforeEach(async () => {
        await entrepotFinancement.ajoute(financementCyberPME);
      });

      it("renvoie une liste de financements préfiltrés sur la région de l'organisation de l'utilisateur", async () => {
        adaptateurRechercheEntreprise.rechercheOrganisations = async () => [
          resultatRechercheEntreprise,
        ];

        await entrepotFinancement.ajoute({
          ...financementCyberPME,
          id: 2,
          regions: ['FR-IDF'],
        });

        const reponse = await request(serveur)
          .get('/api/financements')
          .set('Cookie', [cookieJeanneDupont])
          .send();

        assert.deepEqual(reponse.body, listeDeFinancementsAttendus);
      });

      it('renvoie une liste de financements concernant les TPE uniquement', async () => {
        adaptateurRechercheEntreprise.rechercheOrganisations = async () => [
          { ...resultatRechercheEntreprise, codeTrancheEffectif: '11' },
        ];
        await entrepotFinancement.ajoute({
          ...financementCyberPME,
          id: 2,
          entitesElligibles: ['TPE'],
        });

        const reponse = await request(serveur)
          .get('/api/financements')
          .set('Cookie', [cookieJeanneDupont])
          .send();

        assert.deepEqual(reponse.body, [
          {
            id: 2,
            nom: 'Cyber PME',
            financeur: 'BPI France',
            typesDeFinancement: ['Formation'],
            entitesElligibles: ['TPE'],
            perimetresGeographiques: ['France'],
            regions: ['FRANCE'],
          },
        ]);
      });

      it('renvoie une liste de financements concernant les PME uniquement', async () => {
        adaptateurRechercheEntreprise.rechercheOrganisations = async () => [
          { ...resultatRechercheEntreprise, codeTrancheEffectif: '12' },
        ];
        await entrepotFinancement.ajoute({
          ...financementCyberPME,
          id: 2,
          entitesElligibles: ['TPE'],
        });

        const reponse = await request(serveur)
          .get('/api/financements')
          .set('Cookie', [cookieJeanneDupont])
          .send();

        assert.deepEqual(reponse.body, listeDeFinancementsAttendus);
      });

      it('renvoie une liste de financements concernant les ETI uniquement', async () => {
        adaptateurRechercheEntreprise.rechercheOrganisations = async () => [
          { ...resultatRechercheEntreprise, codeTrancheEffectif: '32' },
        ];
        await entrepotFinancement.ajoute({
          ...financementCyberPME,
          id: 2,
          entitesElligibles: ['TPE'],
        });

        const reponse = await request(serveur)
          .get('/api/financements')
          .set('Cookie', [cookieJeanneDupont])
          .send();

        assert.deepEqual(reponse.body, listeDeFinancementsAttendus);
      });

      it('renvoie une liste de financements concernant les Entreprises uniquement', async () => {
        adaptateurRechercheEntreprise.rechercheOrganisations = async () => [
          { ...resultatRechercheEntreprise, codeTrancheEffectif: '52' },
        ];
        await entrepotFinancement.ajoute({
          ...financementCyberPME,
          id: 2,
          entitesElligibles: ['Entreprises'],
        });

        const reponse = await request(serveur)
          .get('/api/financements')
          .set('Cookie', [cookieJeanneDupont])
          .send();

        assert.deepEqual(reponse.body, [
          {
            id: 2,
            nom: 'Cyber PME',
            financeur: 'BPI France',
            typesDeFinancement: ['Formation'],
            entitesElligibles: ['Entreprises'],
            perimetresGeographiques: ['France'],
            regions: ['FRANCE'],
          },
        ]);
      });

      it('renvoie une liste de financements concernant les collectivités uniquement', async () => {
        adaptateurRechercheEntreprise.rechercheOrganisations = async () => [
          { ...resultatRechercheEntreprise, estCollectivite: true },
        ];
        await entrepotFinancement.ajoute({
          ...financementCyberPME,
          id: 2,
          entitesElligibles: ['Collectivités'],
        });

        const reponse = await request(serveur)
          .get('/api/financements')
          .set('Cookie', [cookieJeanneDupont])
          .send();

        assert.deepEqual(reponse.body, [
          {
            id: 2,
            nom: 'Cyber PME',
            financeur: 'BPI France',
            typesDeFinancement: ['Formation'],
            entitesElligibles: ['Collectivités'],
            perimetresGeographiques: ['France'],
            regions: ['FRANCE'],
          },
        ]);
      });

      it('renvoie une liste de financements concernant les associations uniquement', async () => {
        adaptateurRechercheEntreprise.rechercheOrganisations = async () => [
          { ...resultatRechercheEntreprise, estAssociation: true },
        ];
        await entrepotFinancement.ajoute({
          ...financementCyberPME,
          id: 2,
          entitesElligibles: ['Associations'],
        });

        const reponse = await request(serveur)
          .get('/api/financements')
          .set('Cookie', [cookieJeanneDupont])
          .send();

        assert.deepEqual(reponse.body, [
          {
            id: 2,
            nom: 'Cyber PME',
            financeur: 'BPI France',
            typesDeFinancement: ['Formation'],
            entitesElligibles: ['Associations'],
            perimetresGeographiques: ['France'],
            regions: ['FRANCE'],
          },
        ]);
      });
    });
  });
});
