import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import { Readable } from 'node:stream';
import { beforeEach, describe, it, expect } from 'vitest';
import request from 'supertest';
import { ConfigurationServeur } from '../../src/api/configurationServeur.js';
import { creeServeur } from '../../src/api/msc.js';
import { AdaptateurCellar, CleDuBucket } from '../../src/infra/adaptateurCellar.js';
import { MockBusEvenement } from '../bus/busPourLesTests.js';
import { configurationDeTestDuServeur, fauxAdaptateurCellar } from './fauxObjets.js';

describe('La ressource de visa', () => {
  let serveur: Express;
  let configurationDuServeur: ConfigurationServeur;
  let busEvenements: MockBusEvenement;
  let adaptateurCellar: AdaptateurCellar;

  const construitUnFluxCellar = () => ({
    flux: Readable.from(['0123456789']),
    typeDeContenu: 'application/pdf',
    tailleDuContenu: 10,
  });

  beforeEach(() => {
    busEvenements = new MockBusEvenement();
    adaptateurCellar = {
      ...fauxAdaptateurCellar,
      getStream: async () => construitUnFluxCellar(),
    };
    configurationDuServeur = {
      ...configurationDeTestDuServeur,
      busEvenements,
      cellar: adaptateurCellar,
    };
    serveur = creeServeur(configurationDuServeur);
  });

  describe('sur un GET', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/visas/123456789012');

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it('renvoie un contenu PDF', async () => {
      const reponse = await request(serveur).get('/visas/123456789012');

      expect(reponse.headers['content-type']).toBe('application/pdf');
      expect(reponse.headers['content-length']).toBe('10');
    });

    it('sers le fichier PDF correspondant', async () => {
      let nomDuFichierDemande: string | undefined;
      let cleDuBucketDemandee: CleDuBucket | undefined;
      configurationDuServeur.cellar.getStream = async (nomDuFichier: string, cleDuBucket: CleDuBucket) => {
        nomDuFichierDemande = nomDuFichier;
        cleDuBucketDemandee = cleDuBucket;
        return construitUnFluxCellar();
      };
      const reponse = await request(serveur).get('/visas/123456789012.pdf');

      expect(nomDuFichierDemande).toBe('123456789012.pdf');
      expect(cleDuBucketDemandee).toBe('VISAS');
      expect(reponse.body).toEqual(Buffer.from('0123456789'));
    });

    it('indique le type de contenu', async () => {
      configurationDuServeur.cellar.getStream = async () => ({
        ...construitUnFluxCellar(),
        typeDeContenu: 'application/xml',
      });
      const reponse = await request(serveur).get('/visas/anssi_back to basics_pki_1.0.xml');

      expect(reponse.headers['content-type']).toBe('application/xml');
    });

    it('rend les contenus servis cachable', async () => {
      const reponse = await request(serveur).get('/visas/anssi_back to basics_pki_1.0.xml');

      expect(reponse.headers['cache-control']).toBe(
        'public, max-age=3600, s-maxage=3600, must-revalidate, proxy-revalidate'
      );
      expect(reponse.headers['pragma']).toBe('');
      expect(reponse.headers['expires']).toBe('3600');
      expect(reponse.headers['surrogate-control']).toBe(
        'public, max-age=3600, s-maxage=3600, must-revalidate, proxy-revalidate'
      );
    });

    describe("lorsque le fichier de qualification n'existe pas", () => {
      it('répond 404', async () => {
        configurationDuServeur.cellar.getStream = async () => undefined;
        const reponse = await request(serveur).get('/visas/fichier-qui-n-existe-pas.pdf');

        expect(reponse.status).toBe(HttpStatusCode.NotFound);
      });
    });

    describe('concernant le fichier de contrôle', () => {
      it('n’appelle pas l’adaptateur cellar', async () => {
        let estAppelle: boolean = false;
        adaptateurCellar.getStream = async () => {
          estAppelle = true;
          return undefined;
        };

        await request(serveur).get('/visas/tl-fr.sha2');

        expect(estAppelle).toBe(false);
      });

      it('retourne un statut OK', async () => {
        const reponse = await request(serveur).get('/visas/tl-fr.sha2');

        expect(reponse.status).toBe(HttpStatusCode.Ok);
      });

      it('retourne le haché de la liste de confiance', async () => {
        const reponse = await request(serveur).get('/visas/tl-fr.sha2');

        expect(reponse.body).toEqual(Buffer.from('49daa29a23ab75a58009dce5e2cda4bdd1912e47b07015b2980023f26d581e8b'));
      });
    });
  });
});
