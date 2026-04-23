import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc';
import { EntrepotSessionDeGroupe } from '../../../src/metier/entrepotSessionDeGroupe';
import { SessionDeGroupe } from '../../../src/metier/sessionDeGroupe';
import { EntrepotSessionDeGroupeMemoire } from '../../persistance/EntrepotSessionDeGroupeMemoire';
import { configurationDeTestDuServeur } from '../fauxObjets';

describe('La ressource qui gère une session de groupe', () => {
  let serveur: Express;
  let entrepotSessionDeGroupe: EntrepotSessionDeGroupe;

  beforeEach(() => {
    entrepotSessionDeGroupe = new EntrepotSessionDeGroupeMemoire();
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepotSessionDeGroupe,
    });
  });

  describe('sur requête GET', () => {
    it('répond 200 lorsque la session existe', async () => {
      await entrepotSessionDeGroupe.ajoute(new SessionDeGroupe('ABC2ED'));

      const reponse = await request(serveur).get('/api/sessions-groupe/ABC2ED').send({});

      assert.equal(reponse.status, 200);
    });

    it("répond 404 lorsque la session n'existe pas", async () => {
      const reponse = await request(serveur).get('/api/sessions-groupe/ABC2ED').send({});

      assert.equal(reponse.status, 404);
    });
  });
});
