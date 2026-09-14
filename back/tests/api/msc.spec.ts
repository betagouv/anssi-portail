import { describe, it, expect } from 'vitest';
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

    expect(entetes['content-encoding']).toBe('br');
    expect(entetes['vary']).toBe('Accept-Encoding');
  });

  it('sert correctement le chemin racine', async () => {
    const serveur = creeServeur(configurationDeTestDuServeur);

    const réponse = await request(serveur).get('/');

    expect(réponse.statusCode).toBe(HttpStatusCode.Ok);
  });

  it('redirige correctement le chemin racine', async () => {
    const serveur = creeServeur(configurationDeTestDuServeur);

    const réponse = await request(serveur).get('///////////');

    expect(réponse.statusCode).toBe(HttpStatusCode.PermanentRedirect);
    expect(réponse.headers.location).toBe('/');
  });

  it('redirige vers une url sans slashs finaux', async () => {
    const serveur = creeServeur(configurationDeTestDuServeur);

    const réponse = await request(serveur).get('/catalogue/');

    expect(réponse.statusCode).toBe(HttpStatusCode.PermanentRedirect);
    expect(réponse.headers.location).toBe('/catalogue');
  });

  it('redirige vers une url avec paramètres de requête sans slashs finaux', async () => {
    const serveur = creeServeur(configurationDeTestDuServeur);

    const réponse = await request(serveur).get('/catalogue/?param=value');

    expect(réponse.statusCode).toBe(HttpStatusCode.PermanentRedirect);
    expect(réponse.headers.location).toBe('/catalogue?param=value');
  });

  it("redirige vers l'URL voulue sans slash final", async () => {
    const serveur = creeServeur(configurationDeTestDuServeur);

    const réponse = await request(serveur).get('/guides');

    expect(réponse.statusCode).toBe(HttpStatusCode.MovedPermanently);
    expect(réponse.headers.location).toBe('/catalogue');
  });

  it("redirige vers l'URL voulue avec slash final", async () => {
    const serveur = creeServeur(configurationDeTestDuServeur);

    const réponse = await request(serveur).get('/guides/');

    expect(réponse.statusCode).toBe(HttpStatusCode.MovedPermanently);
    expect(réponse.headers.location).toBe('/catalogue');
  });

  it('redirige URL inconnue sans slash final vers une 404', async () => {
    const serveur = creeServeur(configurationDeTestDuServeur);

    const réponse = await request(serveur).get('/monurlquinexistepas');

    expect(réponse.statusCode).toBe(HttpStatusCode.NotFound);
  });

  it('redirige URL inconnue avec slash final vers une 404', async () => {
    const serveur = creeServeur(configurationDeTestDuServeur);

    const réponse = await request(serveur).get('/monurlquinexistepas/');

    expect(réponse.statusCode).toBe(HttpStatusCode.NotFound);
  });
});
