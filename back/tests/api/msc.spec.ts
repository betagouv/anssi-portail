import assert from 'node:assert';
import { describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../src/api/msc';
import { configurationDeTestDuServeur, fauxFournisseurDeChemin } from './fauxObjets';
import { join } from 'node:path';

describe('La configuration de notre serveur', () => {
  it('compresse les réponses', async () => {
    const serveur = creeServeur({
      ...configurationDeTestDuServeur,
      fournisseurChemin: {
        ...fauxFournisseurDeChemin,
        cheminPageJekyll: () =>
          // On a besoin d'un gros fichier pour que 'compression' décide de compresser (defaut 1024 o)
          join(process.cwd(), 'tests', 'ressources', 'factice-gros.html'),
      },
    });

    const { headers: entetes } = await request(serveur).get('/').set('Accept-Encoding', 'gzip, deflate, br, zstd');

    assert.equal(entetes['content-encoding'], 'br');
    assert.equal(entetes['vary'], 'Accept-Encoding');
  });
});
