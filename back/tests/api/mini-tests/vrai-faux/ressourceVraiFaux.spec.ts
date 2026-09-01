import { Express } from 'express';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../../src/api/msc.js';
import { configurationDeTestDuServeur } from '../../fauxObjets.js';
import assert from 'node:assert';
import { HttpStatusCode } from '@anssi-portail/axios';

describe('La ressource du questionnaire Vrai-Faux', () => {
  let serveur: Express;

  beforeEach(() => {
    serveur = creeServeur(configurationDeTestDuServeur);
  });
  describe('sur une requête GET', () => {
    it('répond un 200', async () => {
      const reponse = await request(serveur).get('/api/mini-tests/vrai-faux');

      assert.equal(reponse.status, HttpStatusCode.Ok);
    });

    it('retourne une liste de questions', async () => {
      const reponse = await request(serveur).get('/api/mini-tests/vrai-faux');

      assert.equal(reponse.body.length, 1);
      assert.equal(reponse.body[0].idQuestion, 'idQuestion1');
      assert.equal(reponse.body[0].libellé.emoji, '🏢');
      assert.equal(
        reponse.body[0].libellé.texte,
        'Les grandes entreprises sont les principales victimes des rançongiciels, pas les PME et TPE.'
      );
      assert.equal(
        reponse.body[0].idéeReçue,
        'FAUX. Les grandes entreprises sont les principales victimes des rançongiciels, pas les PME et TPE.'
      );
      assert.equal(
        reponse.body[0].explications,
        `
Les PME, TPE et ETI sont la catégorie la plus touchée.
En 2025, parmi les victimes d'attaques par rançongiciel portées à la connaissance de l'ANSSI, les PME, TPE et ETI représentent 37 % des cas — c'est la catégorie la plus affectée. Les attaques cybercriminelles ciblent indistinctement la plupart des secteurs et zones géographiques, de façon opportuniste.
`
      );
      assert.equal(reponse.body[0].source, 'ANSSI, Panorama de la cybermenace 2025, section 1.A — pages 10-11.');
      assert.equal(reponse.body[0].estVraie, false);
    });
  });
});
