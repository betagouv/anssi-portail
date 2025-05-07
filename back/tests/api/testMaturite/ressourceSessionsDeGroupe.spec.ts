import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import assert from 'node:assert';
import { creeServeur } from '../../../src/api/msc';
import { configurationDeTestDuServeur } from '../fauxObjets';
import { Express } from 'express';
import { EntrepotSessionDeGroupe } from '../../../src/metier/entrepotSessionDeGroupe';
import { EntrepotSessionDeGroupeMemoire } from '../../persistance/EntrepotSessionDeGroupeMemoire';

describe('La ressource qui gère les sessions de groupe', () => {
  let serveur: Express;
  let entrepotSessionDeGroupe: EntrepotSessionDeGroupe;

  beforeEach(() => {
    entrepotSessionDeGroupe = new EntrepotSessionDeGroupeMemoire();
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepotSessionDeGroupe,
    });
  });

  describe('sur requête POST', () => {
    it('répond 201', async () => {
      const reponse = await request(serveur)
        .post('/api/sessions-groupe')
        .send({});

      assert.equal(reponse.status, 201);
    });

    it('ajoute une session à l’entrepôt', async () => {
      await request(serveur).post('/api/sessions-groupe').send({});

      assert.equal((await entrepotSessionDeGroupe.tous()).length, 1);
    });
  });
});
