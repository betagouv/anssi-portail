import { Express } from 'express';
import assert from 'node:assert';
import { Readable } from 'node:stream';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { ConfigurationServeur } from '../../src/api/configurationServeur';
import { creeServeur } from '../../src/api/msc';
import { VisaTelecharge } from '../../src/bus/evenements/visaTelecharge';
import { CleDuBucket } from '../../src/infra/adaptateurCellar';
import { MockBusEvenement } from '../bus/busPourLesTests';
import { configurationDeTestDuServeur } from './fauxObjets';

describe('La ressource de visa', () => {
  let serveur: Express;
  let configurationDuServeur: ConfigurationServeur;
  let busEvenements: MockBusEvenement;

  const construitUnFluxCellar = () => ({
    flux: Readable.from(['0123456789']),
    typeDeContenu: 'application/pdf',
    tailleDuContenu: 10,
  });

  beforeEach(() => {
    busEvenements = new MockBusEvenement();
    configurationDuServeur = {
      ...configurationDeTestDuServeur,
      busEvenements,
      cellar: {
        get: () => {
          throw new Error('On ne devrait pas appeler cette méthode !');
        },
        getStream: async () => construitUnFluxCellar(),
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
      assert.equal(reponse.headers['content-length'], 10);
    });

    it('sers le fichier PDF correspondant', async () => {
      let nomDuFichierDemande: string | undefined;
      let cleDuBucketDemandee: CleDuBucket | undefined;
      configurationDuServeur.cellar.getStream = async (
        nomDuFichier: string,
        cleDuBucket: CleDuBucket
      ) => {
        nomDuFichierDemande = nomDuFichier;
        cleDuBucketDemandee = cleDuBucket;
        return construitUnFluxCellar();
      };
      const reponse = await request(serveur).get('/visas/123456789012.pdf');

      assert.equal(nomDuFichierDemande, '123456789012.pdf');
      assert.equal(cleDuBucketDemandee, 'VISAS');
      assert.equal(reponse.body, '0123456789');
    });

    it('indique le type de contenu', async () => {
      configurationDuServeur.cellar.getStream = async () => ({
        ...construitUnFluxCellar(),
        typeDeContenu: 'application/xml',
      });
      const reponse = await request(serveur).get(
        '/visas/anssi_back to basics_pki_1.0.xml'
      );

      assert.equal(reponse.headers['content-type'], 'application/xml');
    });

    describe("lorsque le fichier de qualification n'existe pas", () => {
      it('répond 404', async () => {
        configurationDuServeur.cellar.getStream = async () => undefined;
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
