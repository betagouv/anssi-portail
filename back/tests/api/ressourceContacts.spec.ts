import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../src/api/msc/index.js';
import { EntrepotContactStatique } from '../../src/infra/entrepotContactStatique.js';
import { configurationDeTestDuServeur } from './fauxObjets.js';

describe('La ressource Contacts', () => {
  let serveur: Express;
  const entrepotContact = new EntrepotContactStatique();

  beforeEach(() => {
    serveur = creeServeur({ ...configurationDeTestDuServeur, entrepotContact });
  });

  it('répond 200 avec les contacts régionaux, sectoriels et nationaux', async () => {
    const reponse = await request(serveur).get('/api/contacts');

    expect(reponse.status).toBe(HttpStatusCode.Ok);
    expect(reponse.body).toStrictEqual({
      regionaux: await entrepotContact.regionaux(),
      sectoriels: await entrepotContact.sectoriels(),
      nationaux: await entrepotContact.nationaux(),
    });
  });
});
