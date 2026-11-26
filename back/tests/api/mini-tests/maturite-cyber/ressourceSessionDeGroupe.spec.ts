import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { HttpStatusCode } from '@anssi-portail/axios';
import { EntrepotSessionDeGroupe } from '@metier/mini-tests/maturite-cyber/entrepotSessionDeGroupe.js';
import { SessionDeGroupe } from '@metier/mini-tests/maturite-cyber/sessionDeGroupe.js';
import { creeServeur } from '@api/msc/index.js';
import { EntrepotSessionDeGroupeMemoire } from '../../../persistance/entrepotSessionDeGroupeMemoire.js';
import { configurationDeTestDuServeur } from '../../fauxObjets.js';

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

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it("répond 404 lorsque la session n'existe pas", async () => {
      const reponse = await request(serveur).get('/api/sessions-groupe/ABC2ED').send({});

      expect(reponse.status).toBe(HttpStatusCode.NotFound);
    });
  });
});
