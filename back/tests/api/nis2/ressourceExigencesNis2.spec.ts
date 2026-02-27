import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc';
import { ExigenceNIS2 } from '../../../src/metier/nis2/exigence';
import { EntrepotExigenceMemoire } from '../../persistance/entrepotExigenceMemoire';
import { configurationDeTestDuServeur } from '../fauxObjets';

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
        new ExigenceNIS2({
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
          correspondances: {},
        },
      ]);
    });

    it('renvoie le détails des correspondances des exigences', async () => {
      await entrepotExigence.ajoute(
        new ExigenceNIS2({
          reference: '',
          entitesCible: [],
          objectifSecurite: '',
          thematique: '',
          contenu: '',
          niveau: 'faible',
          observations: 'Des observations',
          referentielCompare: 'ISO',
          exigences: [
            {
              contenu: 'contenu 1',
              reference: 'reference_1',
            },
          ],
        })
      );

      const { body } = await request(serveur).get('/api/exigences-nis2');

      assert.equal(body[0].correspondances['ISO'].niveau, 'faible');
      assert.equal(
        body[0].correspondances['ISO'].observations,
        'Des observations'
      );
      assert.deepEqual(body[0].correspondances['ISO'].exigences, [
        {
          contenu: 'contenu 1',
          reference: 'reference_1',
        },
      ]);
    });
  });
});
