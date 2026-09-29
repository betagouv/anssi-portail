import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ClientHttp } from '../../src/infra/clientHttp.js';
import { EntrepotGristGenerique } from './EntrepotGristGenerique.js';
import { fabriqueClientGet, fabriqueFauxClientHttp } from './fournisseurClientHttp.js';

const UNE_MINUTE = Temporal.Duration.from({ minutes: 1 });
const DEUX_HEURES = Temporal.Duration.from({ hours: 2 });

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
    const entrepotRessourcesCyberGrist = new EntrepotGristGenerique(clientHttp, 'urlDeBase', 'cleApi', UNE_MINUTE);

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
    const entrepotRessourcesCyberGrist = new EntrepotGristGenerique(clientHttp, 'urlDeBase', 'cleApi', UNE_MINUTE);

    const premier = await entrepotRessourcesCyberGrist.avecFiltre(1);
    const second = await entrepotRessourcesCyberGrist.avecFiltre(2);

    expect(premier).not.toStrictEqual(second);
  });

  const ilSePasse2Heures = (): void => {
    vi.advanceTimersByTime(DEUX_HEURES.total('milliseconds'));
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
    const entrepotRessourcesCyberGrist = new EntrepotGristGenerique(clientHttp, 'urlDeBase', 'cleApi', UNE_MINUTE);
    await entrepotRessourcesCyberGrist.tous();
    ilSePasse2Heures();

    const resultat = await entrepotRessourcesCyberGrist.tous();

    expect(resultat).toStrictEqual([{ test: 'une chaine' }]);
  });
});
