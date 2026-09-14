import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import { beforeEach, describe, it, expect } from 'vitest';
import request from 'supertest';
import { creeServeur } from '../../src/api/msc.js';
import { AdaptateurEnvironnement } from '../../src/infra/adaptateurEnvironnement.js';
import { MockCmsCrisp } from '../mockCmsCrisp.js';
import { configurationDeTestDuServeur, fauxAdaptateurEnvironnement } from './fauxObjets.js';

describe('quand requête GET sur `/api/pages-crisp/un-id-d-article`', () => {
  let serveur: Express;
  let cmsCrisp: MockCmsCrisp;
  let adaptateurEnvironnement: AdaptateurEnvironnement;

  beforeEach(() => {
    cmsCrisp = new MockCmsCrisp();
    cmsCrisp.ajouteArticle('ID_PROMOUVOIR_MSC', {
      titre: '',
      description: '',
      contenu: '',
      tableDesMatieres: [],
    });
    adaptateurEnvironnement = {
      ...fauxAdaptateurEnvironnement,
      crisp: () => ({
        idArticle: (id: string) => `ID_${id}`,
      }),
    };
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      cmsCrisp,
      adaptateurEnvironnement,
    });
  });

  it('retourne un statut 200', async () => {
    const reponse = await request(serveur).get('/api/pages-crisp/promouvoir_msc');

    expect(reponse.status).toBe(HttpStatusCode.Ok);
  });

  it('retourne un article du CMS', async () => {
    cmsCrisp.ajouteArticle('ID_PROMOUVOIR_MSC', {
      titre: 'Promouvoir MSC',
      description: 'si vous aimez MSC...',
      contenu: '<h1>Promo</h1>',
      tableDesMatieres: [
        { id: 'Section 1', texte: 'Section 1', profondeur: 1 },
        { id: 'Section 2', texte: 'Section 2', profondeur: 1 },
      ],
    });

    const reponse = await request(serveur).get('/api/pages-crisp/promouvoir_msc');

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
    adaptateurEnvironnement.crisp = () => ({
      idArticle: () => undefined,
    });

    const reponse = await request(serveur).get('/api/pages-crisp/id_inconnu');

    expect(reponse.status).toBe(HttpStatusCode.NotFound);
  });
});
