import axios, { AxiosError, AxiosHeaders, isAxiosError } from '@anssi-portail/axios';
import assert from 'node:assert/strict';
import test from 'node:test';

test('retire les données sensibles des erreurs Axios', async () => {
  const configuration = {
    headers: new AxiosHeaders({ Authorization: 'Bearer secret' }),
  };
  const requete = {
    headers: {
      Authorization: 'Bearer secret',
    },
    method: 'GET',
    path: '/ressource',
  };
  const erreur = new AxiosError('Échec de la requête', undefined, configuration, requete, {
    config: configuration,
    data: {},
    headers: new AxiosHeaders({ 'set-cookie': 'secret' }),
    request: requete,
    status: 500,
    statusText: 'Internal Server Error',
  });

  await assert.rejects(
    axios.get('/ressource', {
      adapter: async () => Promise.reject(erreur),
    }),
    (erreurNettoyee: unknown) => {
      assert.ok(isAxiosError(erreurNettoyee));
      assert.equal(erreurNettoyee.config?.headers, undefined);
      assert.deepEqual(erreurNettoyee.request, { method: 'GET', path: '/ressource' });
      assert.equal(erreurNettoyee.response?.headers, undefined);
      assert.deepEqual(erreurNettoyee.response?.request, { method: 'GET', path: '/ressource' });
      return true;
    }
  );
});
