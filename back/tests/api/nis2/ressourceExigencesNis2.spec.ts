import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc';
import {
  Correspondance,
  ExigenceAE,
  ExigenceISO,
  ExigenceNIS2,
} from '../../../src/metier/nis2/exigence';
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

    it('renvoie une 404 si NIS2 ne figure ni dans la cible, ni dans la source', async () => {
      const { status } = await request(serveur)
        .get('/api/exigences-nis2')
        .query({ source: 'ISO', cible: 'ISO' });

      assert.equal(status, 404);
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

    describe('Si la cible est ISO', () => {
      it('renvoie le détail des correspondances des exigences', async () => {
        await entrepotExigence.ajoute(
          new ExigenceNIS2({
            reference: '',
            entitesCible: [],
            objectifSecurite: '',
            thematique: '',
            contenu: '',
            referentielCompare: 'ISO',
            correspondance: new Correspondance('faible', 'Des observations', [
              {
                reference: 'reference_1',
                contenu: 'contenu 1',
              },
            ]),
          })
        );

        const { body } = await request(serveur)
          .get('/api/exigences-nis2')
          .query({ cible: 'ISO' });

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

    describe('Si la cible est AE', () => {
      it('renvoie le détail des correspondances des exigences', async () => {
        await entrepotExigence.ajoute(
          new ExigenceNIS2({
            reference: '',
            entitesCible: [],
            objectifSecurite: '',
            thematique: '',
            contenu: '',
            referentielCompare: 'AE',
            correspondance: new Correspondance('faible', 'Des observations', [
              {
                reference: 'reference_1',
                contenu: 'contenu 1',
              },
            ]),
          })
        );

        const { body } = await request(serveur)
          .get('/api/exigences-nis2')
          .query({ cible: 'AE' });

        assert.equal(body[0].correspondances['AE'].niveau, 'faible');
        assert.equal(
          body[0].correspondances['AE'].observations,
          'Des observations'
        );
        assert.deepEqual(body[0].correspondances['AE'].exigences, [
          {
            contenu: 'contenu 1',
            reference: 'reference_1',
          },
        ]);
      });
    });
  });

  describe('Si une source est spécifiée', () => {
    it('renvoie la liste des exigences de la source ISO comparée à NIS 2', async () => {
      const source = 'ISO';
      await entrepotExigence.ajoute(
        new ExigenceISO({
          norme: 'ISO 27001',
          chapitre: '5.1 Leadership et engagement',
          reference: '27001:2022-5.1 Titre de l’exigence',
          contenu: '5.1 Titre de l’exigence',
          correspondance: new Correspondance('faible', 'Des observations', []),
        })
      );

      const { body } = await request(serveur)
        .get('/api/exigences-nis2')
        .query({ source, cible: 'NIS2' });

      assert.deepEqual(body, [
        {
          norme: 'ISO 27001',
          chapitre: '5.1 Leadership et engagement',
          reference: '27001:2022-5.1 Titre de l’exigence',
          contenu: '5.1 Titre de l’exigence',
          correspondances: {
            NIS2: {
              niveau: 'faible',
              observations: 'Des observations',
              exigences: [],
            },
          },
        },
      ]);
    });

    it('renvoie la liste des exigences de la source AE comparée à NIS 2', async () => {
      const source = 'AE';
      await entrepotExigence.ajoute(
        new ExigenceAE({
          reference: '1.2.3',
          contenu: 'Contenu de l’exigence AE',
          correspondance: new Correspondance('faible', 'Des observations', []),
        })
      );

      const { body } = await request(serveur)
        .get('/api/exigences-nis2')
        .query({ source, cible: 'NIS2' });

      assert.deepEqual(body, [
        {
          reference: '1.2.3',
          contenu: 'Contenu de l’exigence AE',
          correspondances: {
            NIS2: {
              niveau: 'faible',
              observations: 'Des observations',
              exigences: [],
            },
          },
        },
      ]);
    });
  });
});
