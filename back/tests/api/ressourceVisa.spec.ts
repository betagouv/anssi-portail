import { beforeEach, describe, it } from 'node:test';
import { configurationDeTestDuServeur } from './fauxObjets';
import { creeServeur } from '../../src/api/msc';
import request from 'supertest';
import assert from 'node:assert';
import { Express } from 'express';
import { ConfigurationServeur } from '../../src/api/configurationServeur';
import { CleDuBucket } from '../../src/infra/adaptateurCellar';
import { VisaTelecharge } from '../../src/bus/evenements/visaTelecharge';
import { MockBusEvenement } from '../bus/busPourLesTests';

describe('La ressource de visa', () => {
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
          Promise.resolve({
            contenu: Buffer.from(''),
            typeDeContenu: 'application/pdf',
          }),
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
      let nomDuFichierDemande: string | undefined;
      let cleDuBucketDemandee: CleDuBucket | undefined;
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

      assert.equal(nomDuFichierDemande, '123456789012.pdf');
      assert.equal(cleDuBucketDemandee, 'VISAS');
      assert.equal(reponse.body, 'ABCD');
    });

    it('indique le type de contenu', async () => {
      configurationDuServeur.cellar.get = async () => ({
        contenu: Buffer.from(''),
        typeDeContenu: 'application/xml',
      });
      const reponse = await request(serveur).get(
        '/visas/anssi_back to basics_pki_1.0.xml'
      );

      assert.equal(reponse.headers['content-type'], 'application/xml');
    });

    describe("lorsque le fichier de qualification n'existe pas", () => {
      it('répond 404', async () => {
        configurationDuServeur.cellar.get = async () => undefined;
        const reponse = await request(serveur).get(
          '/visas/fichier-qui-n-existe-pas.pdf'
        );

        assert.equal(reponse.status, 404);
      });
    });

    describe('publie un évènement de téléchergement sur le bus', () => {
      it('avec le nom du fichier', async () => {
        await request(serveur).get('/visas/tl-fr.xml');

        const evenement = busEvenements.recupereEvenement(VisaTelecharge);

        assert.equal(evenement?.nomFichier, 'tl-fr.xml');
      });
    });
  });
});
