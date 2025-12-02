import { beforeEach, describe, it } from 'node:test';
import { configurationDeTestDuServeur } from './fauxObjets';
import { creeServeur } from '../../src/api/msc';
import request from 'supertest';
import assert from 'node:assert';
import { Express } from 'express';
import { ConfigurationServeur } from '../../src/api/configurationServeur';
import { CleDuBucket } from '../../src/infra/adaptateurCellar';

describe('La ressource de visa', () => {
  let serveur: Express;
  let configurationDuServeur: ConfigurationServeur;

  beforeEach(() => {
    configurationDuServeur = {
      ...configurationDeTestDuServeur,
      cellar: {
        get: () =>
          Promise.resolve({ contenu: Buffer.from(''), typeDeContenu: '' }),
      },
    };
    serveur = creeServeur(configurationDuServeur);
  });

  describe('sur un GET', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/visas/123456789012');

      assert.equal(reponse.status, 200);
    });

    it('renvoie un contenu PDF', async () => {
      const reponse = await request(serveur).get('/visas/123456789012');

      assert.equal(reponse.headers['content-type'], 'application/pdf');
    });

    it('sers le fichier PDF correspondant', async () => {
      let nomDuFichierDemande: string;
      let cleDuBucketDemandee: CleDuBucket;
      configurationDuServeur.cellar.get = (
        nomDuFichier: string,
        cleDuBucket: CleDuBucket
      ) => {
        nomDuFichierDemande = nomDuFichier;
        cleDuBucketDemandee = cleDuBucket;
        return Promise.resolve({
          contenu: Buffer.from('ABCD'),
          typeDeContenu: '',
        });
      };
      const reponse = await request(serveur).get('/visas/123456789012.pdf');

      assert.equal(nomDuFichierDemande!, '123456789012.pdf');
      assert.equal(cleDuBucketDemandee!, 'VISAS');
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
