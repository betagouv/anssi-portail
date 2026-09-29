import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Cache } from '../../src/infra/cache.js';

const VINGT_QUATRE_HEURES = Temporal.Duration.from({ hours: 24 });
const VINGT_CINQ_HEURES = Temporal.Duration.from({ hours: 25 });

const ilSePasse25Heures = (): void => {
  vi.advanceTimersByTime(VINGT_CINQ_HEURES.total('milliseconds'));
};

describe('Le système de mise en cache', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2025-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('exécute la fonction passée lorsqu’il n’y a pas de cache', async () => {
    const ressource = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
    const cache = new Cache();

    await cache.get('une-clef', ressource);

    expect(ressource).toHaveBeenCalledOnce();
  });

  it('n’exécute pas la fonction passée lorsqu’il y a du cache', async () => {
    const ressource = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
    const cache = new Cache();

    await cache.get('une-clef', async () => {});
    await cache.get('une-clef', ressource);

    expect(ressource).not.toHaveBeenCalled();
  });

  it('retourne le résultat de la fonction exécutée', async () => {
    const cache = new Cache<string>();
    const laFonction = vi.fn<() => Promise<string>>().mockResolvedValue('une valeur');

    const resultat = await cache.get('une-clef', laFonction);

    expect(resultat).toBe('une valeur');
  });

  it('retourne la valeur mise en cache', async () => {
    const cache = new Cache<string>();
    const laFonction = vi
      .fn<() => Promise<string>>()
      .mockResolvedValueOnce('une valeur_0')
      .mockResolvedValueOnce('une valeur_1');

    await cache.get('une-clef', laFonction);
    const resultat = await cache.get('une-clef', laFonction);

    expect(resultat).toBe('une valeur_0');
    expect(laFonction).toHaveBeenCalledOnce();
  });

  it('effectue une mise en cache limitée dans le temps', async () => {
    const cache = new Cache<string>({ ttl: VINGT_QUATRE_HEURES });
    const laFonction = vi
      .fn<() => Promise<string>>()
      .mockResolvedValueOnce('une valeur_0')
      .mockResolvedValueOnce('une valeur_1');

    await cache.get('une-clef', laFonction);
    ilSePasse25Heures();
    const resultat = await cache.get('une-clef', laFonction);

    expect(resultat).toBe('une valeur_1');
    expect(laFonction).toHaveBeenCalledTimes(2);
  });

  it('la nouvelle valeur après expiration est mise en cache', async () => {
    const cache = new Cache<string>({ ttl: VINGT_QUATRE_HEURES });
    const laFonction = vi
      .fn<() => Promise<string>>()
      .mockResolvedValueOnce('une valeur_0')
      .mockResolvedValueOnce('une valeur_1');

    await cache.get('une-clef', laFonction);
    ilSePasse25Heures();
    await cache.get('une-clef', laFonction);
    const resultat = await cache.get('une-clef', laFonction);

    expect(resultat).toBe('une valeur_1');
    expect(laFonction).toHaveBeenCalledTimes(2);
  });

  describe('en cas d’erreur d’exécution de la fonction', () => {
    it('retourne le cache en cas d’erreur sur un appel suivant', async () => {
      const cache = new Cache<string>({ ttl: VINGT_QUATRE_HEURES });
      const laFonction = vi
        .fn<() => Promise<string>>()
        .mockResolvedValueOnce('une valeur_0')
        .mockResolvedValueOnce('une valeur_1');

      await cache.get('une-clef', laFonction);
      ilSePasse25Heures();
      const resultat = await cache.get('une-clef', () => {
        throw new Error('Erreur mais c’est mis en cache');
      });

      expect(resultat).toBe('une valeur_0');
      expect(laFonction).toHaveBeenCalledOnce();
    });

    it('remonte l’erreur lors du premier appel', async () => {
      const cache = new Cache<string>({ ttl: Temporal.Duration.from({ minutes: 24 }) });
      const laFonction = vi.fn<() => Promise<string>>().mockRejectedValue(new Error('Une erreur est survenue'));

      await expect(cache.get('une-clef', laFonction)).rejects.toMatchObject({ message: 'Une erreur est survenue' });
    });
  });
});
