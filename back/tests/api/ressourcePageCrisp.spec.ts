import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { Express } from 'express';
import { creeServeur } from '../../src/api/msc';
import {
  configurationDeTestDuServeur,
  fauxAdaptateurEnvironnement,
} from './fauxObjets';
import assert from 'node:assert';
import { MockCmsCrisp } from '../mockCmsCrisp';
import { AdaptateurEnvironnement } from '../../src/infra/adaptateurEnvironnement';

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
    const reponse = await request(serveur).get(
      '/api/pages-crisp/promouvoir_msc'
    );

    assert.equal(reponse.status, 200);
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

    const reponse = await request(serveur).get(
      '/api/pages-crisp/promouvoir_msc'
    );

    const page = reponse.body;
    assert.equal(page.titre, 'Promouvoir MSC');
    assert.equal(page.description, 'si vous aimez MSC...');
    assert.equal(page.contenu, '<h1>Promo</h1>');
    assert.deepEqual(page.tableDesMatieres, [
      { id: 'Section 1', texte: 'Section 1', profondeur: 1 },
      { id: 'Section 2', texte: 'Section 2', profondeur: 1 },
    ]);
  });

  it("retourne un statut 404 lorsque l'article n'est pas trouvé", async () => {
    adaptateurEnvironnement.crisp = () => ({
      idArticle: () => undefined,
    });

    const reponse = await request(serveur).get('/api/pages-crisp/id_inconnu');

    assert.equal(reponse.status, 404);
  });

  it('aseptise les paramètres de la requête', async () => {
    cmsCrisp.ajouteArticle('ID_&GT;ID', {
      titre: 'AseptisationOk',
      description: '',
      contenu: '',
      tableDesMatieres: [],
    });
    const reponse = await request(serveur).get('/api/pages-crisp/>id');

    const page = reponse.body;
    assert.equal(page.titre, 'AseptisationOk');
  });
});
