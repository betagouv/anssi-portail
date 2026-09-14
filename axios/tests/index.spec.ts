import axios, { AxiosError, AxiosHeaders, HttpStatusCode, isAxiosError } from '@anssi-portail/axios';
import { expect, it, vi } from 'vitest';

it('retire les données sensibles des erreurs Axios', async () => {
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
    status: HttpStatusCode.InternalServerError,
    statusText: 'Internal Server Error',
  });

  const appel = axios.get('/ressource', {
    adapter: vi.fn().mockRejectedValue(erreur),
  });

  await expect(appel).rejects.toSatisfy(isAxiosError);
  await expect(appel).rejects.not.toHaveProperty('config.headers');
  await expect(appel).rejects.toHaveProperty('request', { method: 'GET', path: '/ressource' });
  await expect(appel).rejects.not.toHaveProperty('response.headers');
  await expect(appel).rejects.toHaveProperty('response.request', { method: 'GET', path: '/ressource' });
});
