import { beforeEach, describe, it } from 'node:test';
import { configurationDeTestDuServeur } from './fauxObjets';
import { creeServeur } from '../../src/api/msc';
import request from 'supertest';
import assert from 'node:assert';
import { Express } from 'express';
import { ConfigurationServeur } from '../../src/api/configurationServeur';

describe('La ressource de qualification', () => {
  let serveur: Express;
  let configurationDuServeur: ConfigurationServeur;

  beforeEach(() => {
    configurationDuServeur = {
      ...configurationDeTestDuServeur,
      cellar: { get: () => Promise.resolve(Buffer.from('')) },
    };
    serveur = creeServeur(configurationDuServeur);
  });

  describe('sur un GET', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get(
        '/qualifications/123456789012'
      );

      assert.equal(reponse.status, 200);
    });

    it('renvoie un contenu PDF', async () => {
      const reponse = await request(serveur).get(
        '/qualifications/123456789012'
      );

      assert.equal(reponse.headers['content-type'], 'application/pdf');
    });

    it('sers le fichier PDF correspondant', async () => {
      let nomDuFichierDemande: string;
      configurationDuServeur.cellar.get = (chemin: string) => {
        nomDuFichierDemande = chemin;
        return Promise.resolve(Buffer.from('ABCD'));
      };
      const reponse = await request(serveur).get(
        '/qualifications/123456789012.pdf'
      );

      assert.equal(nomDuFichierDemande!, '/qualifications/123456789012.pdf');
      assert.equal(reponse.body, 'ABCD');
    });

    describe("lorsque le fichier de qualification n'existe pas", () => {
      it('répond 404', async () => {
        configurationDuServeur.cellar.get = async () => undefined;
        const reponse = await request(serveur).get(
          '/qualifications/fichier-qui-n-existe-pas.pdf'
        );

        assert.equal(reponse.status, 404);
      });
    });
  });
});
