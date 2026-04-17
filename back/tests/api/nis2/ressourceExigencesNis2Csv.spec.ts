import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc';
import { Correspondance, ExigenceNIS2 } from '../../../src/metier/nis2/exigence';
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

    it('commence le contenu CSV avec un BOM', async () => {
      const { text } = await request(serveur).get('/api/exigences-nis2.csv');

      assert.equal(text[0], '\uFEFF');
    });

    it('renvoie une 404 si NIS2 ne figure ni dans la cible, ni dans la source', async () => {
      const { status } = await request(serveur).get('/api/exigences-nis2.csv').query({ source: 'ISO', cible: 'ISO' });

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
          contenuEnAnglais: '',
          referentielCompare: 'ISO',
          correspondance: new Correspondance('faible', 'Des observations', [
            {
              reference: 'reference_1',
              contenu: 'contenu 1',
              contenuEnAnglais: '',
            },
            {
              reference: 'reference_2',
              contenu: 'contenu 2',
              contenuEnAnglais: '',
            },
          ]),
        })
      );

      const { text } = await request(serveur).get('/api/exigences-nis2.csv').query({ cible: 'ISO' });

      assert.equal('string', typeof text);
      const lignes = text.split('\n');
      assert.equal(lignes.length, 3);
      assert.equal(
        lignes[0].slice(1),
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

    it('en prenant en compte la langue fournie', async () => {
      await entrepotExigence.ajoute(
        new ExigenceNIS2({
          reference: '1.1-EI/EE',
          entitesCible: ['EntiteEssentielle', 'EntiteImportante'],
          objectifSecurite: 'Obj 1 : recensement',
          thematique: 'Recensement des SI',
          contenu: 'L’entité liste l’ensemble…',
          contenuEnAnglais: 'The entity lists...',
          referentielCompare: 'ISO',
          correspondance: new Correspondance('faible', 'Des observations', [
            {
              reference: 'reference_1',
              contenu: 'contenu 1',
              contenuEnAnglais: 'first',
            },
            {
              reference: 'reference_2',
              contenu: 'contenu 2',
              contenuEnAnglais: 'second',
            },
          ]),
        })
      );

      const { text } = await request(serveur).get('/api/exigences-nis2.csv').query({ cible: 'ISO', langue: 'EN' });

      assert.equal('string', typeof text);
      const lignes = text.split('\n');
      assert.equal(lignes.length, 3);
      assert.equal(
        lignes[0].slice(1),
        '"Référence";"Contenu";"Objectif";"Thématique";' +
          '"Cibles";"Correspondance";"Observations";"Référence ISO (1)";"Contenu ISO (1)";"Référence ISO (2)";"Contenu ISO (2)"'
      );
      assert.equal(
        lignes[1],
        '"1.1-EI/EE";"The entity lists...";"Obj 1 : recensement";"Recensement des SI";' +
          '"EntiteEssentielle, EntiteImportante";"faible";"Des observations";"reference_1";"first";"reference_2";"second"'
      );
      assert.equal('', lignes[2]);
    });

    describe('renvoie le bon nom de fichier', () => {
      it('pour les exigences NIS2 uniquement', async () => {
        const { headers } = await request(serveur).get('/api/exigences-nis2.csv');

        assert.equal(
          headers['content-disposition'],
          'attachment; filename="Liste_des_exigences_applicables_a_NIS2.csv"'
        );
      });

      it('pour les exigences NIS2 comparées à ISO', async () => {
        const { headers } = await request(serveur).get('/api/exigences-nis2.csv?source=NIS2&cible=ISO');

        assert.equal(headers['content-disposition'], 'attachment; filename="Comparaison_ReCyf-NIS2_ISO.csv"');
      });

      it('pour les exigences NIS2 comparées à AE', async () => {
        const { headers } = await request(serveur).get('/api/exigences-nis2.csv?source=NIS2&cible=AE');

        assert.equal(
          headers['content-disposition'],
          'attachment; filename="Comparaison_ReCyf-NIS2_Annexe_Reglement_execution_2024_2690.csv"'
        );
      });

      it('pour les exigences NIS2 comparées à CyFun23', async () => {
        const { headers } = await request(serveur).get('/api/exigences-nis2.csv?source=NIS2&cible=CyFun23');

        assert.equal(headers['content-disposition'], 'attachment; filename="Comparaison_ReCyf-NIS2_CyFun23.csv"');
      });

      it('pour les exigences ISO comparées à NIS2', async () => {
        const { headers } = await request(serveur).get('/api/exigences-nis2.csv?source=ISO&cible=NIS2');

        assert.equal(headers['content-disposition'], 'attachment; filename="Comparaison_ISO_ReCyf-NIS2.csv"');
      });

      it('pour les exigences AE comparées à NIS2', async () => {
        const { headers } = await request(serveur).get('/api/exigences-nis2.csv?source=AE&cible=NIS2');

        assert.equal(
          headers['content-disposition'],
          'attachment; filename="Comparaison_Annexe_Reglement_execution_2024_2690_ReCyf-NIS2.csv"'
        );
      });

      it('pour les exigences CyFun23 comparées à NIS2', async () => {
        const { headers } = await request(serveur).get('/api/exigences-nis2.csv?source=CyFun23&cible=NIS2');

        assert.equal(headers['content-disposition'], 'attachment; filename="Comparaison_CyFun23_ReCyf-NIS2.csv"');
      });

      it('inclue la langue lorsqu’elle est fournie', async () => {
        const { headers } = await request(serveur).get('/api/exigences-nis2.csv?source=CyFun23&cible=NIS2&langue=EN');

        assert.equal(headers['content-disposition'], 'attachment; filename="Comparaison_CyFun23_ReCyf-NIS2-EN.csv"');
      });

      it("sans préciser la langue lorsqu'on demande le fichier en français", async () => {
        const { headers } = await request(serveur).get('/api/exigences-nis2.csv?source=CyFun23&cible=NIS2&langue=FR');

        assert.equal(headers['content-disposition'], 'attachment; filename="Comparaison_CyFun23_ReCyf-NIS2.csv"');
      });

      it('ignore les langue inconnues', async () => {
        const { headers } = await request(serveur).get('/api/exigences-nis2.csv?source=CyFun23&cible=NIS2&langue=ES');

        assert.equal(headers['content-disposition'], 'attachment; filename="Comparaison_CyFun23_ReCyf-NIS2.csv"');
      });
    });
  });
});
