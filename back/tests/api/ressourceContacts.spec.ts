import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../src/api/msc/index.js';
import { EntrepotContactMemoire } from '../persistance/entrepotContactMemoire.js';
import { configurationDeTestDuServeur } from './fauxObjets.js';

describe('La ressource Contacts', () => {
  let serveur: Express;

  beforeEach(() => {
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepotContact: new EntrepotContactMemoire(
        { 'FR-BRE': { COT: { nom: 'Jérôme LAINE', email: 'bretagne@ssi.gouv.fr' }, designation: 'région' } },
        { aviation: { nom: 'CERT Aviation', siteWeb: 'https://www.cert-aviation.fr/' } }
      ),
    });
  });

  it('répond 200 avec les contacts régionaux et sectoriels', async () => {
    const reponse = await request(serveur).get('/api/contacts');

    expect(reponse.status).toBe(HttpStatusCode.Ok);
    expect(reponse.body).toStrictEqual({
      regionaux: { 'FR-BRE': { COT: { nom: 'Jérôme LAINE', email: 'bretagne@ssi.gouv.fr' }, designation: 'région' } },
      sectoriels: { aviation: { nom: 'CERT Aviation', siteWeb: 'https://www.cert-aviation.fr/' } },
    });
  });
});
