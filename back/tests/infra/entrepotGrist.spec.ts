import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ClientHttp } from '../../src/infra/clientHttp.js';
import { EntrepotGristGenerique } from './EntrepotGristGenerique.js';
import { fabriqueClientGet, fabriqueFauxClientHttp } from './fournisseurClientHttp.js';

describe("L'entrepôt Grist générique", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2025-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('mets en cache le résultat de l’appel à Grist', async () => {
    const clientHttp: ClientHttp = {
      ...fabriqueFauxClientHttp(),
      get: fabriqueClientGet(async () => {
        return { data: { records: [{ test: 'une chaine' }] } };
      }),
    };
    const entrepotRessourcesCyberGrist = new EntrepotGristGenerique(clientHttp, 'urlDeBase', 'cleApi', 60);

    vi.spyOn(clientHttp, 'get');

    await entrepotRessourcesCyberGrist.tous();
    const resultat = await entrepotRessourcesCyberGrist.tous();

    expect(clientHttp.get).toHaveBeenCalledOnce();
    expect(resultat).toStrictEqual([{ test: 'une chaine' }]);
  });

  it("mets en cache les résultats d'appels à Grist avec des filtres différents", async () => {
    const clientHttp: ClientHttp = {
      ...fabriqueFauxClientHttp(),
      get: fabriqueClientGet(async (url: string) => {
        return { data: { records: [{ test: 'une chaine de ' + url }] } };
      }),
    };
    const entrepotRessourcesCyberGrist = new EntrepotGristGenerique(clientHttp, 'urlDeBase', 'cleApi', 60);

    const premier = await entrepotRessourcesCyberGrist.avecFiltre(1);
    const second = await entrepotRessourcesCyberGrist.avecFiltre(2);

    expect(premier).not.toStrictEqual(second);
  });

  const add = (date: Date, duration: { hours: number }) => {
    return new Date(date.getTime() + duration.hours * 3600000);
  };

  const ilSePasse2Heures = (): void => {
    vi.setSystemTime(add(new Date(), { hours: 2 }));
  };

  it("retourne la valeur précédente en cas d'erreur Grist", async () => {
    let i = 0;
    const clientHttp: ClientHttp = {
      ...fabriqueFauxClientHttp(),
      get: fabriqueClientGet(async (_url: string) => {
        if (i === 0) {
          i++;
          return { data: { records: [{ test: 'une chaine' }] } };
        }
        return Promise.reject(new Error('Erreur 404'));
      }),
    };
    const entrepotRessourcesCyberGrist = new EntrepotGristGenerique(clientHttp, 'urlDeBase', 'cleApi', 60);
    await entrepotRessourcesCyberGrist.tous();
    ilSePasse2Heures();

    const resultat = await entrepotRessourcesCyberGrist.tous();

    expect(resultat).toStrictEqual([{ test: 'une chaine' }]);
  });
});
