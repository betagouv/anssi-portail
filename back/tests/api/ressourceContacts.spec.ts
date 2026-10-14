import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../src/api/msc/index.js';
import { EntrepôtContactStatique } from '../../src/infra/entrepotContactStatique.js';
import { configurationDeTestDuServeur } from './fauxObjets.js';

describe('La ressource Contacts', () => {
  let serveur: Express;
  const entrepôtContact = new EntrepôtContactStatique();

  beforeEach(() => {
    serveur = creeServeur({ ...configurationDeTestDuServeur, entrepôtContact });
  });

  it('répond 200 avec les contacts régionaux, sectoriels et nationaux', async () => {
    const reponse = await request(serveur).get('/api/contacts');

    expect(reponse.status).toBe(HttpStatusCode.Ok);
    expect(reponse.body).toStrictEqual({
      regionaux: await entrepôtContact.régionaux(),
      sectoriels: await entrepôtContact.sectoriels(),
      nationaux: await entrepôtContact.nationaux(),
    });
  });
});
