import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import { Readable } from 'node:stream';
import { beforeEach, describe, it, expect } from 'vitest';
import request from 'supertest';
import { ConfigurationServeur } from '../../src/api/configurationServeur.js';
import { creeServeur } from '../../src/api/msc.js';
import { AdaptateurCellar, CleDuBucket } from '../../src/infra/adaptateurCellar.js';
import { configurationDeTestDuServeur, fauxAdaptateurCellar } from './fauxObjets.js';

describe('La ressource des documents de ressource', () => {
  let serveur: Express;
  let configurationDuServeur: ConfigurationServeur;
  let adaptateurCellar: AdaptateurCellar;

  const construitUnFluxCellar = () => ({
    flux: Readable.from(['0123456789']),
    typeDeContenu: 'application/pdf',
    tailleDuContenu: 10,
  });

  beforeEach(() => {
    adaptateurCellar = {
      ...fauxAdaptateurCellar,
      getStream: async () => construitUnFluxCellar(),
    };
    configurationDuServeur = {
      ...configurationDeTestDuServeur,
      cellar: adaptateurCellar,
    };
    serveur = creeServeur(configurationDuServeur);
  });

  describe('sur un GET', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/documents-ressources/fichier_ressource.pdf');

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it('renvoie un contenu PDF', async () => {
      const reponse = await request(serveur).get('/documents-ressources/fichier_ressource.pdf');

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
      const reponse = await request(serveur).get('/documents-ressources/fichier_ressource.pdf');

      expect(nomDuFichierDemande).toBe('fichier_ressource.pdf');
      expect(cleDuBucketDemandee).toBe('RESSOURCES_CYBER');
      expect(reponse.body).toEqual(Buffer.from('0123456789'));
    });

    it('indique le type de contenu', async () => {
      configurationDuServeur.cellar.getStream = async () => ({
        ...construitUnFluxCellar(),
        typeDeContenu: 'application/xml',
      });
      const reponse = await request(serveur).get('/documents-ressources/fichier_ressource.xml');

      expect(reponse.headers['content-type']).toBe('application/xml');
    });

    it('rend les contenus servi cachable', async () => {
      const reponse = await request(serveur).get('/documents-ressources/fichier_ressource.pdf');

      expect(reponse.headers['cache-control']).toBe(
        'public, max-age=3600, s-maxage=3600, must-revalidate, proxy-revalidate'
      );
      expect(reponse.headers['pragma']).toBe('');
      expect(reponse.headers['expires']).toBe('3600');
      expect(reponse.headers['surrogate-control']).toBe(
        'public, max-age=3600, s-maxage=3600, must-revalidate, proxy-revalidate'
      );
    });

    it("répond 404 si la ressource n'existe pas", async () => {
      configurationDuServeur.cellar.getStream = async () => undefined;

      const reponse = await request(serveur).get('/documents-ressources/fichier-qui-n-existe-pas.pdf');

      expect(reponse.status).toBe(HttpStatusCode.NotFound);
    });
  });
});
