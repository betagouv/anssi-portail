import { ClientHttp, Config } from '../../src/infra/clientHttp';

export function fabriqueClientGet(handler: (url: string, config?: Config) => Promise<unknown>): ClientHttp['get'] {
  return async <T>(url: string, config?: Config) => handler(url, config) as T;
}
