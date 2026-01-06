import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { ConfigurationServeur } from '../../../src/api/configurationServeur';
import { creeServeur } from '../../../src/api/msc';
import { DocumentGuideTelecharge } from '../../../src/bus/evenements/documentGuideTelecharge';
import { CleDuBucket } from '../../../src/infra/adaptateurCellar';
import { MockBusEvenement } from '../../bus/busPourLesTests';
import { configurationDeTestDuServeur } from '../fauxObjets';

describe("La ressource de document d'un guide", () => {
  let serveur: Express;
  let configurationDuServeur: ConfigurationServeur;
  let busEvenements: MockBusEvenement;

  beforeEach(() => {
    busEvenements = new MockBusEvenement();
    configurationDuServeur = {
      ...configurationDeTestDuServeur,
      busEvenements,
      cellar: {
        get: () =>
          Promise.resolve({ contenu: Buffer.from(''), typeDeContenu: '' }),
      },
    };
    serveur = creeServeur(configurationDuServeur);
  });

  describe('sur un GET', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get(
        '/documents-guides/anssi_back to basics_pki_1.0.pdf'
      );

      assert.equal(reponse.status, 200);
    });

    it('sers le fichier correspondant', async () => {
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
      const reponse = await request(serveur).get(
        '/documents-guides/anssi_back to basics_pki_1.0.pdf'
      );

      assert.equal(nomDuFichierDemande!, 'anssi_back to basics_pki_1.0.pdf');
      assert.equal(cleDuBucketDemandee!, 'GUIDES');
      assert.equal(reponse.body, 'ABCD');
    });

    it("répond 404 lorsque le fichier de qualification n'existe pas", async () => {
      configurationDuServeur.cellar.get = async () => undefined;
      const reponse = await request(serveur).get(
        '/documents-guides/anssi_back to basics_pki_1.0.pdf'
      );

      assert.equal(reponse.status, 404);
    });

    it("répond 500 lorsque qu'une erreur technique survient", async () => {
      configurationDuServeur.cellar.get = async () => {
        throw new Error('Erreur de test');
      };
      const reponse = await request(serveur).get(
        '/documents-guides/anssi_back to basics_pki_1.0.pdf'
      );

      assert.equal(reponse.status, 500);
    });

    it('indique le type de contenu', async () => {
      configurationDuServeur.cellar.get = async () => ({
        contenu: Buffer.from(''),
        typeDeContenu: 'application/pdf',
      });
      const reponse = await request(serveur).get(
        '/documents-guides/anssi_back to basics_pki_1.0.pdf'
      );

      assert.equal(reponse.headers['content-type'], 'application/pdf');
    });

    it('publie un évènement sur le bus', async () => {
      await request(serveur).get('/documents-guides/zero-trust.pdf');

      const evenement = busEvenements.recupereEvenement(
        DocumentGuideTelecharge
      );

      assert.deepEqual(evenement, {
        nomFichier: 'zero-trust.pdf',
      });
    });
  });
});
