import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc';
import { Mesure } from '../../../src/metier/mesure';
import { EntrepotMesureMemoire } from '../../persistance/entrepotMesureMemoire';
import { configurationDeTestDuServeur } from '../fauxObjets';
import { Express } from 'express';

describe('La ressource mesure de sécurité', () => {
  describe('sur requête GET', () => {
    let serveur: Express;
    let entrepotMesure: EntrepotMesureMemoire;
    beforeEach(() => {
      entrepotMesure = new EntrepotMesureMemoire();
      serveur = creeServeur({ ...configurationDeTestDuServeur, entrepotMesure });
    });

    it('réponds 200', async () => {
      await entrepotMesure.ajoute(new Mesure('AUTH.5'));

      const reponse = await request(serveur).get('/api/mesures/AUTH.5');

      assert.equal(reponse.status, 200);
    });

    it('renvoie les détail de la mesure', async () => {
      await entrepotMesure.ajoute(new Mesure('AUTH.5'));

      const { body } = await request(serveur).get('/api/mesures/AUTH.5');

      assert.equal(body.id, 'AUTH.5');
    });

    it('réponds 404 si la mesure demandée est inconnue', async () => {
      const reponse = await request(serveur).get('/api/mesures/INCONNU.0');

      assert.equal(reponse.status, 404);
    });
  });
});
