import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import { Readable } from 'node:stream';
import { beforeEach, describe, it, expect } from 'vitest';
import request from 'supertest';
import { ConfigurationServeur } from '../../../src/api/configurationServeur.js';
import { creeServeur } from '../../../src/api/msc.js';
import { AdaptateurCellar, CleDuBucket } from '../../../src/infra/adaptateurCellar.js';
import { MockBusEvenement } from '../../bus/busPourLesTests.js';
import { EntrepotGuideMemoire } from '../../persistance/entrepotGuideMemoire.js';
import { configurationDeTestDuServeur, fauxAdaptateurCellar } from '../fauxObjets.js';
import { guideZeroTrust } from '../objetsPretsALEmploi.js';

describe("La ressource de document d'un guide", () => {
  let serveur: Express;
  let configurationDuServeur: ConfigurationServeur;
  let busEvenements: MockBusEvenement;
  let adaptateurCellar: AdaptateurCellar;
  let entrepotGuide: EntrepotGuideMemoire;

  const construitUnFluxCellar = (contenu: string = '0123456789') => ({
    flux: Readable.from([contenu]),
    typeDeContenu: 'application/pdf',
    tailleDuContenu: contenu.length,
  });

  beforeEach(() => {
    busEvenements = new MockBusEvenement();
    entrepotGuide = new EntrepotGuideMemoire();
    adaptateurCellar = {
      ...fauxAdaptateurCellar,
      getStream: async () => construitUnFluxCellar(),
    };
    configurationDuServeur = {
      ...configurationDeTestDuServeur,
      busEvenements,
      cellar: adaptateurCellar,
      entrepotGuide,
    };
    serveur = creeServeur(configurationDuServeur);
  });

  describe('sur un GET', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/documents-guides/anssi_back to basics_pki_1.0.pdf');

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it('sers le fichier correspondant', async () => {
      let nomDuFichierDemande: string;
      let cleDuBucketDemandee: CleDuBucket;
      configurationDuServeur.cellar.getStream = async (nomDuFichier: string, cleDuBucket: CleDuBucket) => {
        nomDuFichierDemande = nomDuFichier;
        cleDuBucketDemandee = cleDuBucket;
        return construitUnFluxCellar('ABCD');
      };

      const reponse = await request(serveur).get('/documents-guides/anssi_back to basics_pki_1.0.pdf');

      expect(nomDuFichierDemande!).toBe('anssi_back to basics_pki_1.0.pdf');
      expect(cleDuBucketDemandee!).toBe('GUIDES');
      expect(reponse.body).toEqual(Buffer.from('ABCD'));
    });

    describe("lorsque le document de guide n'existe pas", () => {
      it('répond 404', async () => {
        configurationDuServeur.cellar.getStream = async () => undefined;
        const reponse = await request(serveur).get('/documents-guides/anssi_back to basics_pki_1.0.pdf');

        expect(reponse.status).toBe(HttpStatusCode.NotFound);
      });

      it("répond 301 et pointe vers le guide qui contenait ce document, s'il s'agit d'un ancien document", async () => {
        configurationDuServeur.cellar.getStream = async () => undefined;
        const guide = guideZeroTrust();
        guide.nomsAnciensDocuments = ['ancien_anssi_back to basics_pki_1.0.pdf'];
        await entrepotGuide.ajoute(guide);

        const reponse = await request(serveur).get('/documents-guides/ancien_anssi_back to basics_pki_1.0.pdf');

        expect(reponse.status).toBe(HttpStatusCode.MovedPermanently);
        expect(reponse.headers['location']).toBe('/guides/zero-trust');
      });
    });

    it("répond 500 lorsque qu'une erreur technique survient", async () => {
      configurationDuServeur.cellar.getStream = async () => {
        throw new Error('Erreur de test');
      };
      const reponse = await request(serveur).get('/documents-guides/anssi_back to basics_pki_1.0.pdf');

      expect(reponse.status).toBe(HttpStatusCode.InternalServerError);
    });

    it('indique le type de contenu', async () => {
      configurationDuServeur.cellar.getStream = async () => ({
        ...construitUnFluxCellar(),
        typeDeContenu: 'application/xml',
      });

      const reponse = await request(serveur).get('/documents-guides/anssi_back to basics_pki_1.0.xml');

      expect(reponse.headers['content-type']).toBe('application/xml');
    });

    it('rend les contenus servis cachable', async () => {
      const reponse = await request(serveur).get('/documents-guides/anssi_back to basics_pki_1.0.xml');

      expect(reponse.headers['cache-control']).toBe(
        'public, max-age=3600, s-maxage=3600, must-revalidate, proxy-revalidate'
      );
      expect(reponse.headers['pragma']).toBe('');
      expect(reponse.headers['expires']).toBe('3600');
      expect(reponse.headers['surrogate-control']).toBe(
        'public, max-age=3600, s-maxage=3600, must-revalidate, proxy-revalidate'
      );
    });
  });
});
