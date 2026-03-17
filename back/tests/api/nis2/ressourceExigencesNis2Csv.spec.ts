import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc';
import {
  Correspondance,
  ExigenceNIS2,
} from '../../../src/metier/nis2/exigence';
import { EntrepotExigenceMemoire } from '../../persistance/entrepotExigenceMemoire';
import { configurationDeTestDuServeur } from '../fauxObjets';

describe('La ressource des Exigences NIS 2 en CSV', () => {
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
      const { status } = await request(serveur).get('/api/exigences-nis2.csv');

      assert.equal(status, 200);
    });

    it('renvoie un contenu CSV', async () => {
      const { headers } = await request(serveur).get('/api/exigences-nis2.csv');

      assert.equal(headers['content-type'], 'text/csv; charset=utf-8');
    });

    it('renvoie une 404 si NIS2 ne figure ni dans la cible, ni dans la source', async () => {
      const { status } = await request(serveur)
        .get('/api/exigences-nis2.csv')
        .query({ source: 'ISO', cible: 'ISO' });

      assert.equal(status, 404);
    });

    describe('Renvoie une 400', () => {
      it("si la source n'est pas une chaîne de caractères", async () => {
        const { status } = await request(serveur)
          .get('/api/exigences-nis2.csv')
          .query({ source: [123, 456] });

        assert.equal(status, 400);
      });

      it("si la cible n'est pas une chaîne de caractères", async () => {
        const { status } = await request(serveur)
          .get('/api/exigences-nis2.csv')
          .query({ cible: [123, 456] });

        assert.equal(status, 400);
      });
    });

    it('renvoie la liste des exigences', async () => {
      await entrepotExigence.ajoute(
        new ExigenceNIS2({
          reference: '1.1-EI/EE',
          entitesCible: ['EntiteEssentielle', 'EntiteImportante'],
          objectifSecurite: 'Obj 1 : recensement',
          thematique: 'Recensement des SI',
          contenu: 'L’entité liste l’ensemble…',
          referentielCompare: 'ISO',
          correspondance: new Correspondance('faible', 'Des observations', [
            {
              reference: 'reference_1',
              contenu: 'contenu 1',
            },
            {
              reference: 'reference_2',
              contenu: 'contenu 2',
            },
          ]),
        })
      );

      const { text } = await request(serveur)
        .get('/api/exigences-nis2.csv')
        .query({ cible: 'ISO' });

      assert.equal('string', typeof text);
      const lignes = text.split('\n');
      assert.equal(lignes.length, 3);
      assert.equal(
        lignes[0],
        '"Référence";"Contenu";"Objectif";"Thématique";' +
          '"Cibles";"Correspondance";"Observations";"Référence ISO (1)";"Contenu ISO (1)";"Référence ISO (2)";"Contenu ISO (2)"'
      );
      assert.equal(
        lignes[1],
        '"1.1-EI/EE";"L’entité liste l’ensemble…";"Obj 1 : recensement";"Recensement des SI";' +
          '"EntiteEssentielle, EntiteImportante";"faible";"Des observations";"reference_1";"contenu 1";"reference_2";"contenu 2"'
      );
      assert.equal('', lignes[2]);
    });
  });
});
