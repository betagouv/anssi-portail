import { beforeEach, describe, it } from 'node:test';
import { Express } from 'express';
import assert from 'node:assert';
import { configurationDeTestDuServeur, fauxAdaptateurProfilAnssi, fauxMiddleware } from './fauxObjets';
import { creeServeur } from '../../src/api/msc';
import request from 'supertest';
import { AdaptateurProfilAnssi } from '../../src/infra/adaptateurProfilAnssi';

describe('La ressource Contacts', () => {
  let serveur: Express;
  let adaptateurProfilAnssi: AdaptateurProfilAnssi;

  beforeEach(() => {
    adaptateurProfilAnssi = fauxAdaptateurProfilAnssi;
    serveur = creeServeur({ ...configurationDeTestDuServeur, adaptateurProfilAnssi, middleware: fauxMiddleware });
  });

  describe('sur demande GET', () => {
    it('utilise le middleware de verification de JWT', async () => {
      let middelwareAppele = false;
      serveur = creeServeur({
        ...configurationDeTestDuServeur, middleware: {
         ...fauxMiddleware,
          verifieJWT: async (_, __, suite) => {
            middelwareAppele = true;
            suite();
          },
        },
      });
      await request(serveur).get('/api/contacts');

      assert.equal(middelwareAppele, true);
    });

    it("renvoie une 404 si les informations de l'utilisateur ne sont pas disponibles dans le Profil ANSSI", async () => {
      adaptateurProfilAnssi.recupere = async () => undefined

      const reponse = await request(serveur).get('/api/contacts');

      assert.equal(reponse.status, 404);
    });

    it("récupère les informations de l'utilisateur via le Profil ANSSI", async () => {
      let adaptateurAppele;
      adaptateurProfilAnssi.recupere = async () => {
        adaptateurAppele = true;
        return undefined;
      }

      await request(serveur).get('/api/contacts');

      assert.equal(adaptateurAppele, true);
    });

    it('retourne les informations de contacts', async () => {
      adaptateurProfilAnssi.recupere = async () => {
        return {
          email: '',
          prenom: '',
          nom: '',
          telephone: '',
          domainesSpecialite: [],
          organisation: { nom: '', siret: '', departement: '59' },
        };
      }

      const reponse = await request(serveur).get('/api/contacts');

      assert.equal(reponse.body.CSIRT.nom, 'CSIRT Hauts-de-France');
    });
  });
});
