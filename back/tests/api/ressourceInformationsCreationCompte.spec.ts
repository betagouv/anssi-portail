import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { beforeEach, describe, it, expect } from 'vitest';
import request from 'supertest';
import { AdaptateurJWT } from '../../src/api/adaptateurJWT.js';
import { creeServeur } from '../../src/api/msc.js';
import { AdaptateurProfilAnssi } from '../../src/infra/adaptateurProfilAnssi.js';
import { AdaptateurRechercheEntreprise } from '../../src/infra/adaptateurRechercheEntreprise.js';
import {
  configurationDeTestDuServeur,
  fauxAdaptateurJWT,
  fauxAdaptateurProfilAnssi,
  fauxAdaptateurRechercheEntreprise,
} from './fauxObjets.js';

const { JsonWebTokenError } = jsonwebtoken;

describe("La ressource d'informations de création de compte", () => {
  let serveur: Express;
  let adaptateurJWT: AdaptateurJWT;
  let adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise;
  let adaptateurProfilAnssi: AdaptateurProfilAnssi;

  beforeEach(() => {
    adaptateurJWT = fauxAdaptateurJWT;
    adaptateurRechercheEntreprise = fauxAdaptateurRechercheEntreprise;
    adaptateurProfilAnssi = fauxAdaptateurProfilAnssi;

    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      adaptateurJWT,
      adaptateurRechercheEntreprise,
      adaptateurProfilAnssi,
    });
  });

  describe('sur demande GET', () => {
    it('jette une erreur si le token est invalide', async () => {
      adaptateurJWT.decode = () => {
        throw new JsonWebTokenError('Token manquant');
      };
      const reponse = await request(serveur).get('/api/informations-creation-compte?token=unMauvaisToken');

      expect(reponse.status).toBe(HttpStatusCode.Unauthorized);
    });

    it('renvoie les informations utilisateur si le token est valide', async () => {
      let tokenRecu;
      adaptateurJWT.decode = (token: string) => {
        tokenRecu = token;
        return {
          prenom: 'Jeanne',
          nom: 'Dupont',
        };
      };
      const reponse = await request(serveur).get('/api/informations-creation-compte?token=unBonToken');

      expect(reponse.status).toBe(HttpStatusCode.Ok);
      expect(reponse.body).toEqual({
        prenom: 'Jeanne',
        nom: 'Dupont',
      });
      expect(tokenRecu).toBe('unBonToken');
    });

    describe("lorsque l'utilisateur n'est pas connu de MPA", () => {
      it("complète les informations de l'organisation si le siret est présent dans le token", async () => {
        adaptateurJWT.decode = () => ({
          siret: '1234',
        });
        adaptateurProfilAnssi.recupere = async () => undefined;
        adaptateurRechercheEntreprise.rechercheOrganisations = async (terme: string) => [
          {
            siret: terme,
            departement: '75',
            nom: 'MonOrganisation',
            codeTrancheEffectif: '01',
            codeRegion: 'FR-ARA',
            codeSecteur: 'D',
            estAssociation: false,
            estCollectivite: false,
            codeActivite: '62.01Z',
          },
        ];

        const reponse = await request(serveur).get('/api/informations-creation-compte?token=unBonToken');
        expect(reponse.body.organisation).toEqual({
          siret: '1234',
          departement: '75',
          nom: 'MonOrganisation',
        });
      });
      it("ne complète pas les informations de l'organisation si le siret n'est pas présent dans le token", async () => {
        adaptateurJWT.decode = () => ({
          email: 'jeanne.dujardin@mail.com',
        });
        adaptateurProfilAnssi.recupere = async () => undefined;
        let rechercheEntrepriseAppelee = false;
        adaptateurRechercheEntreprise.rechercheOrganisations = async () => {
          rechercheEntrepriseAppelee = true;
          return [];
        };

        const reponse = await request(serveur).get('/api/informations-creation-compte?token=unBonToken');

        expect(rechercheEntrepriseAppelee).toBe(false);
        expect(reponse.body.organisation).toBeUndefined();
      });
    });

    describe("lorsque l'utilisateur est connu de MPA", () => {
      it('complète les informations du profil avec les infos de MPA', async () => {
        adaptateurJWT.decode = () => ({
          email: 'jeanne.dujardin@mail.com',
        });
        adaptateurProfilAnssi.recupere = async (email) => {
          if (email !== 'jeanne.dujardin@mail.com') {
            return undefined;
          }
          return {
            domainesSpecialite: ['RSSI'],
            nom: 'Dujardin',
            prenom: 'Jeanne',
            organisation: { siret: '1234', nom: 'MonOrga', departement: '75' },
            telephone: '0102030405',
            email,
          };
        };

        const reponse = await request(serveur).get('/api/informations-creation-compte?token=unBonToken');

        expect(reponse.body.nom).toBe('Dujardin');
        expect(reponse.body.prenom).toBe('Jeanne');
        expect(reponse.body.telephone).toBe('0102030405');
        expect(reponse.body.organisation.siret).toBe('1234');
        expect(reponse.body.organisation.departement).toBe('75');
        expect(reponse.body.organisation.nom).toBe('MonOrga');
        expect(reponse.body.domainesSpecialite).toEqual(['RSSI']);
      });

      it("ne complète pas les informations de l'organisation car elles sont déjà dispos dans le profil MPA", async () => {
        adaptateurJWT.decode = () => ({
          email: 'jeanne.dujardin@mail.com',
          siret: '1234',
        });
        adaptateurProfilAnssi.recupere = async (email) => ({
          domainesSpecialite: ['RSSI'],
          nom: 'Dujardin',
          prenom: 'Jeanne',
          organisation: { siret: '1234', nom: 'MonOrga', departement: '75' },
          telephone: '0102030405',
          email,
        });
        let rechercheEntrepriseAppelee = false;
        adaptateurRechercheEntreprise.rechercheOrganisations = async (_terme: string) => {
          rechercheEntrepriseAppelee = true;
          return [];
        };

        const reponse = await request(serveur).get('/api/informations-creation-compte?token=unBonToken');

        expect(rechercheEntrepriseAppelee).toBe(false);
        expect(reponse.body.organisation.siret).toBe('1234');
        expect(reponse.body.organisation.departement).toBe('75');
        expect(reponse.body.organisation.nom).toBe('MonOrga');
      });
    });
  });
});
