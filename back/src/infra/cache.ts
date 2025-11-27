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

  get(clefCache: string, fonction: () => T): T {
    if (this.cache.has(clefCache)) {
      const { valeur, dateExpiration } = this.cache.get(clefCache)!;
      if (
        dateExpiration &&
        isAfter(FournisseurHorloge.maintenant(), dateExpiration)
      ) {
        return this.metsEnCache(fonction, clefCache);
      }
      return valeur;
    }
    return this.metsEnCache(fonction, clefCache);
  }

  private metsEnCache(fonction: () => T, clefCache: string): T {
    try {
      const resultat = fonction();
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
