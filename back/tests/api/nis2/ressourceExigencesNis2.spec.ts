import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc';
import {
  Correspondance,
  ExigenceAE,
  ExigenceCyFun23,
  ExigenceISO,
  ExigenceNIS2,
} from '../../../src/metier/nis2/exigence';
import { EntrepotExigenceMemoire } from '../../persistance/entrepotExigenceMemoire';
import {
  configurationDeTestDuServeur,
  fauxAdaptateurEnvironnement,
} from '../fauxObjets';
import { AdaptateurEnvironnement } from '../../../src/infra/adaptateurEnvironnement';

describe('La ressource des Exigences NIS 2', () => {
  let serveur: Express;
  let entrepotExigence: EntrepotExigenceMemoire;
  let adaptateurEnvironnement: AdaptateurEnvironnement;
  let afficheCyFun23: boolean;

  beforeEach(() => {
    afficheCyFun23 = true;
    entrepotExigence = new EntrepotExigenceMemoire();
    adaptateurEnvironnement = {
      ...fauxAdaptateurEnvironnement,
      fonctionnalites: () => ({
        ...fauxAdaptateurEnvironnement.fonctionnalites(),
        nis2: () => ({
          afficheObservations: () => true,
          afficheCyFun23: () => afficheCyFun23,
        }),
      }),
    };
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      adaptateurEnvironnement,
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

    it('renvoie une 404 si une comparaison avec CyFun23 est demandée, et que le FF est désactivé', async () => {
      afficheCyFun23 = false;

      const { status } = await request(serveur)
        .get('/api/exigences-nis2')
        .query({ cible: 'CyFun23' });

      assert.equal(status, 404);
    });

    describe('Renvoit une 400', () => {
      it("si la source n'est pas une chaîne de caractères", async () => {
        const { status } = await request(serveur)
          .get('/api/exigences-nis2')
          .query({ source: [123, 456] });

        assert.equal(status, 400);
      });

      it("si la cible n'est pas une chaîne de caractères", async () => {
        const { status } = await request(serveur)
          .get('/api/exigences-nis2')
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

    describe('Si la cible est CyFun23', () => {
      it('renvoie le détail des correspondances des exigences', async () => {
        await entrepotExigence.ajoute(
          new ExigenceNIS2({
            reference: '',
            entitesCible: [],
            objectifSecurite: '',
            thematique: '',
            contenu: '',
            referentielCompare: 'CyFun23',
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
          .query({ cible: 'CyFun23' });

        assert.equal(body[0].correspondances['CyFun23'].niveau, 'faible');
        assert.equal(
          body[0].correspondances['CyFun23'].observations,
          'Des observations'
        );
        assert.deepEqual(body[0].correspondances['CyFun23'].exigences, [
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

    it('renvoie la liste des exigences de la source CyFun23 comparée à NIS 2', async () => {
      const source = 'CyFun23';
      await entrepotExigence.ajoute(
        new ExigenceCyFun23({
          reference: 'ID.AM-1.3',
          contenu: 'Lorsque du matériel non autorisé est détecté, ...',
          fonction: 'Identifier',
          estMesureCle: true,
          niveauAssurance: 'Important',
          correspondance: new Correspondance('faible', 'Des observations', []),
        })
      );

      const { body } = await request(serveur)
        .get('/api/exigences-nis2')
        .query({ source, cible: 'NIS2' });

      assert.deepEqual(body, [
        {
          reference: 'ID.AM-1.3',
          contenu: 'Lorsque du matériel non autorisé est détecté, ...',
          fonction: 'Identifier',
          niveauAssurance: 'Important',
          estMesureCle: true,
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
