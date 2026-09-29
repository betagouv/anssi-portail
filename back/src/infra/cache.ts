import { FournisseurHorloge } from './fournisseurHorloge.js';

const maintenant = () => Temporal.Instant.fromEpochMilliseconds(FournisseurHorloge.maintenant().getTime());

type EntreeDeCache<T> = {
  expiration?: Temporal.Instant;
  valeur: T;
};

export class Cache<T> {
  private readonly cache: Map<string, EntreeDeCache<T>> = new Map();
  private readonly requetesEnVol: Map<string, Promise<T>> = new Map();

  constructor(private readonly configuration?: { ttl: Temporal.Duration }) {}

  supprimeTout() {
    this.cache.clear();
    this.requetesEnVol.clear();
  }

  async get(clefCache: string, fonction: () => Promise<T>): Promise<T> {
    if (this.cache.has(clefCache)) {
      const { valeur, expiration } = this.cache.get(clefCache)!;
      if (expiration && Temporal.Instant.compare(maintenant(), expiration) > 0) {
        return await this.metsEnCache(fonction, clefCache);
      }
      return valeur;
    }

    if (this.requetesEnVol.has(clefCache)) {
      return this.requetesEnVol.get(clefCache)!;
    }

    return await this.metsEnCache(fonction, clefCache);
  }

  private metsEnCache(fonction: () => Promise<T>, clefCache: string): Promise<T> {
    const promesse = (async () => {
      try {
        const resultat = await fonction();
        this.cache.set(clefCache, {
          valeur: resultat,
          ...(this.configuration && {
            expiration: maintenant().add(this.configuration.ttl),
          }),
        });
        return resultat;
      } catch (erreur: unknown | Error) {
        if (this.cache.has(clefCache)) {
          return this.cache.get(clefCache)!.valeur;
        }
        throw erreur;
      }
    })().finally(() => {
      this.requetesEnVol.delete(clefCache);
    });

    this.requetesEnVol.set(clefCache, promesse);
    return promesse;
  }
}
