import { Express } from 'express';
import assert from 'node:assert';
import { Readable } from 'node:stream';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { ConfigurationServeur } from '../../src/api/configurationServeur';
import { creeServeur } from '../../src/api/msc';
import { configurationDeTestDuServeur } from './fauxObjets';
import { CleDuBucket } from '../../src/infra/adaptateurCellar';

describe('La ressource des documents de ressource', () => {
  let serveur: Express;
  let configurationDuServeur: ConfigurationServeur;

  const construitUnFluxCellar = () => ({
    flux: Readable.from(['0123456789']),
    typeDeContenu: 'application/pdf',
    tailleDuContenu: 10,
  });

  beforeEach(() => {
    const erreur = () => {
      throw new Error('On ne devrait pas appeler cette méthode !');
    };
    configurationDuServeur = {
      ...configurationDeTestDuServeur,
      cellar: {
        get: erreur,
        existe: erreur,
        getStream: async () => construitUnFluxCellar(),
      },
    };
    serveur = creeServeur(configurationDuServeur);
  });

  describe('sur un GET', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/documents-ressources/fichier_ressource.pdf');

      assert.equal(reponse.status, 200);
    });

    it('renvoie un contenu PDF', async () => {
      const reponse = await request(serveur).get('/documents-ressources/fichier_ressource.pdf');

      assert.equal(reponse.headers['content-type'], 'application/pdf');
      assert.equal(reponse.headers['content-length'], 10);
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

      assert.equal(nomDuFichierDemande, 'fichier_ressource.pdf');
      assert.equal(cleDuBucketDemandee, 'RESSOURCES_CYBER');
      assert.equal(reponse.body, '0123456789');
    });

    it('indique le type de contenu', async () => {
      configurationDuServeur.cellar.getStream = async () => ({
        ...construitUnFluxCellar(),
        typeDeContenu: 'application/xml',
      });
      const reponse = await request(serveur).get('/documents-ressources/fichier_ressource.xml');

      assert.equal(reponse.headers['content-type'], 'application/xml');
    });
  });
});
