import { AxiosError, AxiosResponse, HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../src/api/msc.js';
import { MockCmsCrisp } from '../mockCmsCrisp.js';
import { configurationDeTestDuServeur } from './fauxObjets.js';

describe('quand requête GET sur `/api/pages-crisp/un-id-d-article`', () => {
  let serveur: Express;
  let cmsCrisp: MockCmsCrisp;

  beforeEach(() => {
    cmsCrisp = new MockCmsCrisp();
    cmsCrisp.ajouteArticle('01a0f2e5-3f95-73ec-884c-a88529dcbd2f', {
      titre: '',
      description: '',
      contenu: '',
      tableDesMatieres: [],
    });
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      cmsCrisp,
    });
  });

  it('retourne un statut 200', async () => {
    const reponse = await request(serveur).get('/api/pages-crisp/01a0f2e5-3f95-73ec-884c-a88529dcbd2f');

    expect(reponse.status).toBe(HttpStatusCode.Ok);
  });

  it('retourne un article du CMS', async () => {
    cmsCrisp.ajouteArticle('01a0f2e5-3f95-73ec-884c-a88529dcbd2f', {
      titre: 'Promouvoir MSC',
      description: 'si vous aimez MSC...',
      contenu: '<h1>Promo</h1>',
      tableDesMatieres: [
        { id: 'Section 1', texte: 'Section 1', profondeur: 1 },
        { id: 'Section 2', texte: 'Section 2', profondeur: 1 },
      ],
    });

    const reponse = await request(serveur).get('/api/pages-crisp/01a0f2e5-3f95-73ec-884c-a88529dcbd2f');

    const page = reponse.body;
    expect(page.titre).toBe('Promouvoir MSC');
    expect(page.description).toBe('si vous aimez MSC...');
    expect(page.contenu).toBe('<h1>Promo</h1>');
    expect(page.tableDesMatieres).toEqual([
      { id: 'Section 1', texte: 'Section 1', profondeur: 1 },
      { id: 'Section 2', texte: 'Section 2', profondeur: 1 },
    ]);
  });

  it("retourne un statut 404 lorsque l'article n'est pas trouvé", async () => {
    const responseData = 'some string';
    const response: AxiosResponse = {
      data: responseData,
      status: HttpStatusCode.NotFound,
    } as AxiosResponse;
    cmsCrisp.recupereArticle = async () => {
      throw new AxiosError('Message', '404', undefined, undefined, response);
    };
    const reponse = await request(serveur).get('/api/pages-crisp/01a0f2e5-3f95-73ec-884c-a88529dcbd2f');

    expect(reponse.status).toBe(HttpStatusCode.NotFound);
  });

  it("retourne un statut 400 lorsque l'identifiant de l'article n'est pas un UUID valide", async () => {
    const reponse = await request(serveur).get('/api/pages-crisp/pas-un-uuid');

    expect(reponse.status).toBe(HttpStatusCode.BadRequest);
  });
});
