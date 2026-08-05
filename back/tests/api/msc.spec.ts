import assert from 'node:assert';
import { describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../src/api/msc.js';
import { configurationDeTestDuServeur, fauxFournisseurDeChemin } from './fauxObjets.js';
import { join } from 'node:path';
import { HttpStatusCode } from '@anssi-portail/axios';

describe('La configuration de notre serveur', () => {
  it('compresse les réponses', async () => {
    const serveur = creeServeur({
      ...configurationDeTestDuServeur,
      fournisseurChemin: {
        ...fauxFournisseurDeChemin,
        jekyll: {
          ...fauxFournisseurDeChemin.jekyll,
          page: () =>
            // On a besoin d'un gros fichier pour que 'compression' décide de compresser (defaut 1024 o)
            join(process.cwd(), 'tests', 'ressources', 'factice-gros.html'),
        },
      },
    });

    const { headers: entetes } = await request(serveur).get('/').set('Accept-Encoding', 'gzip, deflate, br, zstd');

    assert.equal(entetes['content-encoding'], 'br');
    assert.equal(entetes['vary'], 'Accept-Encoding');
  });

  it('sert correctement le chemin racine', async () => {
    const serveur = creeServeur(configurationDeTestDuServeur);

    const réponse = await request(serveur).get('/');

    assert.equal(réponse.statusCode, HttpStatusCode.Ok);
  });

  it('redirige correctement le chemin racine', async () => {
    const serveur = creeServeur(configurationDeTestDuServeur);

    const réponse = await request(serveur).get('///////////');

    assert.equal(réponse.statusCode, HttpStatusCode.PermanentRedirect);
    assert.equal(réponse.headers.location, '/');
  });

  it('redirige vers une url sans slashs finaux', async () => {
    const serveur = creeServeur(configurationDeTestDuServeur);

    const réponse = await request(serveur).get('/catalogue/');

    assert.equal(réponse.statusCode, HttpStatusCode.PermanentRedirect);
    assert.equal(réponse.headers.location, '/catalogue');
  });

  it('redirige vers une url avec paramètres de requête sans slashs finaux', async () => {
    const serveur = creeServeur(configurationDeTestDuServeur);

    const réponse = await request(serveur).get('/catalogue/?param=value');

    assert.equal(réponse.statusCode, HttpStatusCode.PermanentRedirect);
    assert.equal(réponse.headers.location, '/catalogue?param=value');
  });

  it("redirige vers l'URL voulue sans slash final", async () => {
    const serveur = creeServeur(configurationDeTestDuServeur);

    const réponse = await request(serveur).get('/guides');

    assert.equal(réponse.statusCode, HttpStatusCode.MovedPermanently);
    assert.equal(réponse.headers.location, '/catalogue');
  });

  it("redirige vers l'URL voulue avec slash final", async () => {
    const serveur = creeServeur(configurationDeTestDuServeur);

    const réponse = await request(serveur).get('/guides/');

    assert.equal(réponse.statusCode, HttpStatusCode.MovedPermanently);
    assert.equal(réponse.headers.location, '/catalogue');
  });

  it('redirige URL inconnue sans slash final vers une 404', async () => {
    const serveur = creeServeur(configurationDeTestDuServeur);

    const réponse = await request(serveur).get('/monurlquinexistepas');

    assert.equal(réponse.statusCode, HttpStatusCode.NotFound);
  });

  it('redirige URL inconnue avec slash final vers une 404', async () => {
    const serveur = creeServeur(configurationDeTestDuServeur);

    const réponse = await request(serveur).get('/monurlquinexistepas/');

    assert.equal(réponse.statusCode, HttpStatusCode.NotFound);
  });
});
