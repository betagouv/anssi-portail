import { ClientHttp, Config } from '../../src/infra/clientHttp';

export const fabriqueFauxClientHttp: () => ClientHttp = () => ({
  get: fabriqueClientGet(async () => {}),
  post: fabriqueClientPost(async () => {}),
  put: fabriqueClientPut(async () => {}),
});

export function fabriqueClientGet(handler: (url: string, config?: Config) => Promise<unknown>): ClientHttp['get'] {
  return async <T>(url: string, config?: Config) => handler(url, config) as T;
}

export function fabriqueClientPost(
  handler: (url: string, corps: unknown, config?: Config) => Promise<unknown>
): ClientHttp['post'] {
  return async <C, R>(url: string, corps: C, config?: Config) => handler(url, corps, config) as R;
}

export function fabriqueClientPut(
  handler: (url: string, corps: unknown, config?: Config) => Promise<unknown>
): ClientHttp['put'] {
  return async <C, R>(url: string, corps: C, config?: Config) => handler(url, corps, config) as R;
}
