import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { ConfigurationServeur } from '../../../src/api/configurationServeur';
import { creeServeur } from '../../../src/api/msc';
import { configurationDeTestDuServeur } from '../fauxObjets';

describe("La ressource de document d'un guide", () => {
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
        '/documents-guides/anssi_back to basics_pki_1.0.pdf'
      );

      assert.equal(reponse.status, 200);
    });

    it('sers le fichier correspondant', async () => {
      let nomDuFichierDemande: string;
      configurationDuServeur.cellar.get = (chemin: string) => {
        nomDuFichierDemande = chemin;
        return Promise.resolve(Buffer.from('ABCD'));
      };
      const reponse = await request(serveur).get(
        '/documents-guides/anssi_back to basics_pki_1.0.pdf'
      );

      assert.equal(
        nomDuFichierDemande!,
        '/guides/anssi_back to basics_pki_1.0.pdf'
      );
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
  });
});
