import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../src/api/msc.js';
import { Financement } from '../../src/metier/financement.js';
import { ChargeurFinancements } from '../../src/infra/enrichissement/chargementProprietes/chargeurFinancements.js';
import { RésolveurDePage } from '../../src/infra/enrichissement/résolveurDePage.js';
import { JSDOM } from 'jsdom';
import { slugsFinancements } from '../../src/metier/slugsFinancements.js';
import { EntrepotFinancementMemoire } from '../persistance/entrepotFinancementMemoire.js';
import { configurationDeTestDuServeur } from './fauxObjets.js';
import { financementCyberPME } from './objetsPretsALEmploi.js';

describe('Les URL publiques des financements', () => {
  let serveur: ReturnType<typeof creeServeur>;
  let entrepotFinancement: EntrepotFinancementMemoire;

  beforeEach(async () => {
    entrepotFinancement = new EntrepotFinancementMemoire();
    await entrepotFinancement.ajoute(financementCyberPME);
    serveur = creeServeur({ ...configurationDeTestDuServeur, entrepotFinancement });
  });

  it('attribue une URL distincte à chacun des 39 financements', () => {
    const slugs = Object.values(slugsFinancements);
    assert.equal(slugs.length, 39);
    assert.equal(new Set(slugs).size, slugs.length);
    assert.equal(slugsFinancements[1], 'cyber-pme');
    assert.equal(slugsFinancements[2], 'accompagnement-cybiah');
    assert.equal(slugsFinancements[47], 'feder-soutien-a-la-digitalisation-des-pme');
    for (const slug of slugs) assert.match(slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });

  for (const [id, slug] of Object.entries(slugsFinancements)) {
    it(`redirige directement les anciennes URL du financement ${id}`, async () => {
      for (const prefixe of ['financement', 'financements']) {
        for (const suffixe of ['', '/', '?source=test', '/?source=test']) {
          const reponse = await request(serveur).get(`/${prefixe}/${id}${suffixe}`);
          assert.equal(reponse.status, 301);
          assert.equal(reponse.headers.location, `/financements/${slug}${suffixe.includes('?') ? '?source=test' : ''}`);
        }
      }
      const reponse = await request(serveur).get(`/financements?idFinancement=${id}`);
      assert.equal(reponse.status, 301);
      assert.equal(reponse.headers.location, `/financements/${slug}`);
    });
  }

  it('sert la page par slug et conserve l’API par ID', async () => {
    assert.equal((await request(serveur).get('/financements/cyber-pme')).status, 200);
    const reponse = await request(serveur).get('/api/financements/1');
    assert.equal(reponse.status, 200);
    assert.equal(reponse.body.id, 1);
    assert.equal(reponse.body.slug, 'cyber-pme');
    assert.equal(reponse.headers.location, undefined);
    assert.equal((await request(serveur).get('/api/financements/cyber-pme')).status, 404);
  });

  it('ne publie pas un financement sans correspondance, même si son nom est exploitable', async () => {
    const financement = new Financement({
      ...financementCyberPME,
      id: 999,
      nom: 'Nouveau financement',
      regions: ['France'],
    });
    await entrepotFinancement.ajoute(financement);

    assert.equal(financement.slug, undefined);
    for (const chemin of [
      '/financement/999',
      '/financements/999',
      '/financements/nouveau-financement',
      '/api/financements/nouveau-financement',
    ]) {
      assert.equal((await request(serveur).get(chemin)).status, 404, chemin);
    }
    const detail = await request(serveur).get('/api/financements/999');
    assert.equal(detail.status, 200);
    assert.equal(detail.body.id, 999);
    assert.equal(detail.headers.location, undefined);

    const liste = await request(serveur).get('/api/financements');
    assert.deepEqual(
      liste.body.map((financement: { id: number }) => financement.id),
      [1, 999]
    );

    const chargeur = new ChargeurFinancements(
      new RésolveurDePage(configurationDeTestDuServeur.entrepotGuide, entrepotFinancement),
      entrepotFinancement
    );
    const props = await chargeur.charge(new JSDOM(), '/financements');
    assert.deepEqual(
      props?.financementsInitiaux?.map((financement) => financement.id),
      [1]
    );
  });

  it('répond 404 pour une page ou un slug API inconnu', async () => {
    assert.equal((await request(serveur).get('/financements/inconnu')).status, 404);
    assert.equal((await request(serveur).get('/api/financements/inconnu')).status, 404);
    assert.equal((await request(serveur).get('/financements?idFinancement=999')).status, 404);
  });
});
