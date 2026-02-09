// import { add, isAfter } from 'date-fns';
import { FournisseurHorloge } from './fournisseurHorloge';

const add = (date: Date, duration: { seconds: number }) => {
  return new Date(date.getTime() + duration.seconds * 1000);
};

const isAfter = (dateA: Date, dateB: Date): boolean => {
  return dateA.getTime() > dateB.getTime();
};

type EntreeDeCache<T> = {
  dateExpiration?: Date;
  valeur: T;
};

type Secondes = number;

export class Cache<T> {
  private readonly cache: Map<string, EntreeDeCache<T>> = new Map();

  constructor(private readonly configuration?: { ttl: Secondes }) {}

  async get(clefCache: string, fonction: () => Promise<T>): Promise<T> {
    if (this.cache.has(clefCache)) {
      const { valeur, dateExpiration } = this.cache.get(clefCache)!;
      if (
        dateExpiration &&
        isAfter(FournisseurHorloge.maintenant(), dateExpiration)
      ) {
        return await this.metsEnCache(fonction, clefCache);
      }
      return valeur;
    }
    return await this.metsEnCache(fonction, clefCache);
  }

  private async metsEnCache(
    fonction: () => Promise<T>,
    clefCache: string
  ): Promise<T> {
    try {
      const resultat = await fonction();
      this.cache.set(clefCache, {
        valeur: resultat,
        ...(this.configuration && {
          dateExpiration: add(FournisseurHorloge.maintenant(), {
            seconds: this.configuration.ttl,
          }),
        }),
      });
      return resultat;
    } catch (erreur: unknown | Error) {
      if (this.cache.has(clefCache)) {
        return this.cache.get(clefCache)!.valeur;
      }
      throw erreur;
    }
  }
}
