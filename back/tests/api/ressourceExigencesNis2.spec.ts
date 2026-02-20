import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../src/api/msc';
import { Exigence } from '../../src/metier/Exigence';
import { EntrepotExigenceMemoire } from '../persistance/EntrepotExigenceMemoire';
import { configurationDeTestDuServeur } from './fauxObjets';

describe('La ressource des Exigences NIS 2', () => {
  let serveur: Express;
  let entrepotExigence: EntrepotExigenceMemoire;

  beforeEach(() => {
    entrepotExigence = new EntrepotExigenceMemoire();
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepotExigence,
    });
  });

  describe('Sur demande GET', () => {
    it('renvoie en 200', async () => {
      const { status } = await request(serveur).get('/api/exigences-nis2');

      assert.equal(status, 200);
    });

    it('renvoie la liste des exigences', async () => {
      await entrepotExigence.ajoute(
        new Exigence({
          reference: '1.1-EI/EE',
          entitesCible: ['EntiteEssentielle', 'EntiteImportante'],
          objectifSecurite: 'Obj 1 : recensement',
          thematique: 'Recensement des SI',
          contenu: 'L’entité liste l’ensemble…',
        })
      );

      const { body } = await request(serveur).get('/api/exigences-nis2');

      assert.deepEqual(body, [
        {
          reference: '1.1-EI/EE',
          entitesCible: ['EntiteEssentielle', 'EntiteImportante'],
          objectifSecurite: 'Obj 1 : recensement',
          thematique: 'Recensement des SI',
          contenu: 'L’entité liste l’ensemble…',
        },
      ]);
    });
  });
});
