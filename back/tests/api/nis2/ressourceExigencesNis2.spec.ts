import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../../src/api/msc.js';
import { AdaptateurEnvironnement } from '../../../src/infra/adaptateurEnvironnement.js';
import {
  Correspondance,
  ExigenceAE,
  ExigenceCyFun23,
  ExigenceISO,
  ExigenceNIS2,
} from '../../../src/metier/nis2/exigence.js';
import { EntrepotExigenceMemoire } from '../../persistance/entrepotExigenceMemoire.js';
import { configurationDeTestDuServeur, fauxAdaptateurEnvironnement } from '../fauxObjets.js';

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
          afficheCyFun23: () => afficheCyFun23,
          afficheSimulateur: () => true,
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

      expect(status).toBe(HttpStatusCode.Ok);
    });

    it('renvoie une 404 si NIS2 ne figure ni dans la cible, ni dans la source', async () => {
      const { status } = await request(serveur).get('/api/exigences-nis2').query({ source: 'ISO', cible: 'ISO' });

      expect(status).toBe(HttpStatusCode.NotFound);
    });

    it('renvoie une 404 si une comparaison avec CyFun23 est demandée, et que le FF est désactivé', async () => {
      afficheCyFun23 = false;

      const { status } = await request(serveur).get('/api/exigences-nis2').query({ cible: 'CyFun23' });

      expect(status).toBe(HttpStatusCode.NotFound);
    });

    describe('Renvoit une 400', () => {
      it("si la source n'est pas une chaîne de caractères", async () => {
        const { status } = await request(serveur)
          .get('/api/exigences-nis2')
          .query({ source: [123, 456] });

        expect(status).toBe(HttpStatusCode.BadRequest);
      });

      it("si la cible n'est pas une chaîne de caractères", async () => {
        const { status } = await request(serveur)
          .get('/api/exigences-nis2')
          .query({ cible: [123, 456] });

        expect(status).toBe(HttpStatusCode.BadRequest);
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
          contenuEnAnglais: "Requirement's content",
        })
      );

      const { body } = await request(serveur).get('/api/exigences-nis2');

      expect(body).toEqual([
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
            contenuEnAnglais: "Requirement's content",
            referentielCompare: 'ISO',
            correspondance: new Correspondance('faible', { contenu: 'Des observations' }, [
              {
                reference: 'reference_1',
                contenu: 'contenu 1',
                contenuEnAnglais: "Requirement's content",
              },
            ]),
          })
        );

        const { body } = await request(serveur).get('/api/exigences-nis2').query({ cible: 'ISO' });

        expect(body[0].correspondances['ISO'].niveau).toBe('faible');
        expect(body[0].correspondances['ISO'].observations).toBe('Des observations');
        expect(body[0].correspondances['ISO'].exigences).toEqual([
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
            contenuEnAnglais: "Requirement's content",
            referentielCompare: 'AE',
            correspondance: new Correspondance('faible', { contenu: 'Des observations' }, [
              {
                reference: 'reference_1',
                contenu: 'contenu 1',
                contenuEnAnglais: "Requirement's content",
              },
            ]),
          })
        );

        const { body } = await request(serveur).get('/api/exigences-nis2').query({ cible: 'AE' });

        expect(body[0].correspondances['AE'].niveau).toBe('faible');
        expect(body[0].correspondances['AE'].observations).toBe('Des observations');
        expect(body[0].correspondances['AE'].exigences).toEqual([
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
            contenuEnAnglais: "Requirement's content",
            referentielCompare: 'CyFun23',
            correspondance: new Correspondance('faible', { contenu: 'Des observations' }, [
              {
                reference: 'reference_1',
                contenu: 'contenu 1',
                contenuEnAnglais: "Requirement's content",
              },
            ]),
          })
        );

        const { body } = await request(serveur).get('/api/exigences-nis2').query({ cible: 'CyFun23' });

        expect(body[0].correspondances['CyFun23'].niveau).toBe('faible');
        expect(body[0].correspondances['CyFun23'].observations).toBe('Des observations');
        expect(body[0].correspondances['CyFun23'].exigences).toEqual([
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
          contenuEnAnglais: "Requirement's content",
          correspondance: new Correspondance('faible', { contenu: 'Des observations' }, []),
        })
      );

      const { body } = await request(serveur).get('/api/exigences-nis2').query({ source, cible: 'NIS2' });

      expect(body).toEqual([
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
          contenuEnAnglais: "Requirement's content",
          correspondance: new Correspondance('faible', { contenu: 'Des observations' }, []),
        })
      );

      const { body } = await request(serveur).get('/api/exigences-nis2').query({ source, cible: 'NIS2' });

      expect(body).toEqual([
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
          contenuEnAnglais: 'When unauthorized hardware is detected...',
          fonction: 'Identifier',
          estMesureCle: true,
          niveauAssurance: 'Important',
          correspondance: new Correspondance('faible', { contenu: 'Des observations' }, []),
        })
      );

      const { body } = await request(serveur).get('/api/exigences-nis2').query({ source, cible: 'NIS2' });

      expect(body).toEqual([
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

    describe('lorsque la langue est précisée', () => {
      it('renvoie le contenu en anglais', async () => {
        await entrepotExigence.ajoute(
          new ExigenceNIS2({
            reference: '',
            entitesCible: [],
            objectifSecurite: '',
            thematique: '',
            contenu: '',
            contenuEnAnglais: 'This is awesome',
            referentielCompare: 'CyFun23',
            correspondance: new Correspondance('faible', { contenu: 'Des observations' }, [
              {
                reference: 'reference_1',
                contenu: 'contenu 1',
                contenuEnAnglais: 'new content',
              },
            ]),
          })
        );
        const { body } = await request(serveur).get('/api/exigences-nis2').query({ langue: 'EN' });

        expect(body[0].contenu).toBe('This is awesome');
        expect(body[0].correspondances['CyFun23'].exigences[0].contenu).toBe('new content');
      });

      it('renvoie les observations en anglais', async () => {
        await entrepotExigence.ajoute(
          new ExigenceNIS2({
            reference: '',
            entitesCible: [],
            objectifSecurite: '',
            thematique: '',
            contenu: '',
            contenuEnAnglais: 'This is awesome',
            referentielCompare: 'CyFun23',
            correspondance: new Correspondance(
              'faible',
              { contenu: 'Des observations', contenuEnAnglais: 'some observation' },
              [
                {
                  reference: 'reference_1',
                  contenu: 'contenu 1',
                  contenuEnAnglais: 'new content',
                },
              ]
            ),
          })
        );
        const { body } = await request(serveur).get('/api/exigences-nis2').query({ langue: 'EN' });

        expect(body[0].correspondances['CyFun23'].observations).toBe('some observation');
      });
    });
  });
});
