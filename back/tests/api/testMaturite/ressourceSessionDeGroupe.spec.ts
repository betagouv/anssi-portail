import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import assert from 'node:assert';
import { creeServeur } from '../../../src/api/msc';
import { configurationDeTestDuServeur } from '../fauxObjets';
import { Express } from 'express';
import { EntrepotSessionDeGroupe } from '../../../src/metier/entrepotSessionDeGroupe';
import { EntrepotSessionDeGroupeMemoire } from '../../persistance/EntrepotSessionDeGroupeMemoire';
import { SessionDeGroupe } from '../../../src/metier/sessionDeGroupe';

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

      const reponse = await request(serveur)
        .get('/api/sessions-groupe/ABC2ED')
        .send({});

      assert.equal(reponse.status, 200);
    });

    it("répond 404 lorsque la session n'existe pas", async () => {
      const reponse = await request(serveur)
        .get('/api/sessions-groupe/ABC2ED')
        .send({});

      assert.equal(reponse.status, 404);
    });

    it('aseptise le code passé en paramètre', async () => {
      await entrepotSessionDeGroupe.ajoute(new SessionDeGroupe('ABC2&lt;D'));

      const reponse = await request(serveur)
        .get('/api/sessions-groupe/ABC2<D')
        .send({});

      assert.equal(reponse.status, 200);
    });
  });
});
