import { beforeEach, describe, it } from 'node:test';
import { Express } from 'express';
import assert from 'node:assert';
import {
  configurationDeTestDuServeur,
  fauxAdaptateurJWT,
  fauxAdaptateurProfilAnssi,
  fauxAdaptateurRechercheEntreprise,
} from './fauxObjets';
import { creeServeur } from '../../src/api/msc';
import request from 'supertest';
import { AdaptateurJWT } from '../../src/api/adaptateurJWT';
import { JsonWebTokenError } from 'jsonwebtoken';
import { AdaptateurRechercheEntreprise } from '../../src/infra/adaptateurRechercheEntreprise';
import { AdaptateurProfilAnssi } from '../../src/infra/adaptateurProfilAnssi';

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
      const reponse = await request(serveur).get(
        '/api/informations-creation-compte?token=unMauvaisToken'
      );

      assert.equal(reponse.status, 401);
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
      const reponse = await request(serveur).get(
        '/api/informations-creation-compte?token=unBonToken'
      );

      assert.equal(reponse.status, 200);
      assert.deepEqual(reponse.body, {
        prenom: 'Jeanne',
        nom: 'Dupont',
      });
      assert.equal(tokenRecu, 'unBonToken');
    });

    describe("lorsque l'utilisateur n'est pas connu de MPA", () => {
      it("complète les informations de l'organisation si le siret est présent dans le token", async () => {
        adaptateurJWT.decode = () => ({
          siret: '1234',
        });
        adaptateurProfilAnssi.recupere = async () => undefined;
        adaptateurRechercheEntreprise.rechercheOrganisations = async (
          terme: string
        ) => [
          {
            siret: terme,
            departement: '75',
            nom: 'MonOrganisation',
          },
        ];

        const reponse = await request(serveur).get(
          '/api/informations-creation-compte?token=unBonToken'
        );
        assert.deepEqual(reponse.body.organisation, {
          siret: '1234',
          departement: '75',
          nom: 'MonOrganisation',
        });
      });
      it("ne complète pas les informations de l'organisation si le siret n'est pas présent dans le token", async () => {
        adaptateurJWT.decode = () => ({
          email: 'jeanne.dujardin@mail.com',
        });
        adaptateurProfilAnssi.recupere = async (email) => undefined;
        let rechercheEntrepriseAppelee = false;
        adaptateurRechercheEntreprise.rechercheOrganisations = async (
          _terme: string
        ) => {
          rechercheEntrepriseAppelee = true;
          return [];
        };

        const reponse = await request(serveur).get(
          '/api/informations-creation-compte?token=unBonToken'
        );

        assert.equal(rechercheEntrepriseAppelee, false);
        assert.equal(reponse.body.organisation, undefined);
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

        const reponse = await request(serveur).get(
          '/api/informations-creation-compte?token=unBonToken'
        );

        assert.equal(reponse.body.nom, 'Dujardin');
        assert.equal(reponse.body.prenom, 'Jeanne');
        assert.equal(reponse.body.telephone, '0102030405');
        assert.equal(reponse.body.organisation.siret, '1234');
        assert.equal(reponse.body.organisation.departement, '75');
        assert.equal(reponse.body.organisation.nom, 'MonOrga');
        assert.deepEqual(reponse.body.domainesSpecialite, ['RSSI']);
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
        adaptateurRechercheEntreprise.rechercheOrganisations = async (
          terme: string
        ) => {
          rechercheEntrepriseAppelee = true;
          return [];
        };

        const reponse = await request(serveur).get(
          '/api/informations-creation-compte?token=unBonToken'
        );

        assert.equal(rechercheEntrepriseAppelee, false);
        assert.equal(reponse.body.organisation.siret, '1234');
        assert.equal(reponse.body.organisation.departement, '75');
        assert.equal(reponse.body.organisation.nom, 'MonOrga');
      });
    });
  });
});
