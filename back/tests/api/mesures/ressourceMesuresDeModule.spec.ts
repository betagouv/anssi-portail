import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc';
import { AdaptateurEnvironnement } from '../../../src/infra/adaptateurEnvironnement';
import { EntrepotMesureMemoire } from '../../persistance/entrepotMesureMemoire';
import { configurationDeTestDuServeur, fauxAdaptateurEnvironnement } from '../fauxObjets';
import { mesureAuthentA2Etapes } from '../objetsPretsALEmploi';
import { mesureDeTest } from './constructeurDeMesure';

describe('La ressource des mesures de sécurité d’un module', () => {
  describe('sur requête GET', () => {
    let serveur: Express;
    let entrepotMesure: EntrepotMesureMemoire;
    let adaptateurEnvironnement: AdaptateurEnvironnement;

    beforeEach(() => {
      adaptateurEnvironnement = {
        ...fauxAdaptateurEnvironnement,
      };
      entrepotMesure = new EntrepotMesureMemoire();
      serveur = creeServeur({ ...configurationDeTestDuServeur, entrepotMesure, adaptateurEnvironnement });
    });

    it('réponds 200', async () => {
      const reponse = await request(serveur).get('/api/modules/cyberdepart/mesures');

      assert.equal(reponse.status, 200);
    });

    it('renvoie la liste des mesures', async () => {
      await entrepotMesure.ajoute(mesureAuthentA2Etapes());

      const { body } = await request(serveur).get('/api/modules/cyberdepart/mesures');

      assert.equal(body.length, 1);
      assert.equal(body[0].id, 'AUTH.5');
    });

    it('trie les mesures par ordre', async () => {
      await entrepotMesure.ajoute(mesureDeTest().avecLId('MES1').avecLOrdre(30).construis());
      await entrepotMesure.ajoute(mesureDeTest().avecLId('MES2').avecLOrdre(10).construis());

      const { body } = await request(serveur).get('/api/modules/cyberdepart/mesures');

      assert.equal(body[0].id, 'MES2');
      assert.equal(body[1].id, 'MES1');
    });

    it('réponds 404 si la fonctionnalité est désactivée', async () => {
      const adaptateurEnvironnement: AdaptateurEnvironnement = {
        ...fauxAdaptateurEnvironnement,
        fonctionnalites: () => ({
          ...fauxAdaptateurEnvironnement.fonctionnalites(),
          parcoursDeSecurisation: () => ({
            estActif: () => false,
          }),
        }),
      };

      await entrepotMesure.ajoute(mesureAuthentA2Etapes());

      const serveurSansLaRessource = creeServeur({
        ...configurationDeTestDuServeur,
        entrepotMesure,
        adaptateurEnvironnement,
      });
      const reponse = await request(serveurSansLaRessource).get('/api/modules/cyberdepart/mesures');

      assert.equal(reponse.status, 404);
    });
  });
});
