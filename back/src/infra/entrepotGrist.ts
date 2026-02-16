import { Cache } from './cache';
import { ClientHttp } from './clientHttp';

export type ReponseGrist<TYPE_DOCUMENT> = {
  records: TYPE_DOCUMENT[];
};

type Filtre = Record<string, unknown[]>;

type Tri = {
  cle: string;
  ordre: 'ASC' | 'DESC';
};

type OptionsAppelGrist = { filtre?: Filtre; tri?: Tri };

export class EntrepotGrist<TYPE_DOCUMENT> {
  private readonly cache: Cache<ReponseGrist<TYPE_DOCUMENT>>;

  constructor(
    private readonly clientHttp: ClientHttp<ReponseGrist<TYPE_DOCUMENT>>,
    private readonly urlDeBase: string,
    private readonly cleApi: string,
    dureeCacheEnSecondes: number
  ) {
    this.cache = new Cache({ ttl: dureeCacheEnSecondes });
  }

  protected appelleGrist(options: OptionsAppelGrist = {}) {
    if (!this.urlDeBase) {
      return { records: [] };
    }

    const url = this.construisUrl(options);
    return this.cache.get(url, async () => {
      const reponse = await this.clientHttp.get(url.toString(), {
        headers: {
          authorization: `Bearer ${this.cleApi}`,
          accept: 'application/json',
        },
      });
      return reponse.data;
    });
  }

  private construisUrl({ filtre, tri }: OptionsAppelGrist = {}) {
    if (tri) {
      return `${this.urlDeBase}?sort=${tri.ordre === 'DESC' ? '-' : ''}${tri.cle}`;
    } else if (filtre) {
      return `${this.urlDeBase}?filter=${encodeURIComponent(JSON.stringify(filtre))}`;
    }
    return this.urlDeBase;
  }

  protected aseptiseListe<T>(colonne: T[] | null | undefined): T[] {
    return colonne?.slice(1) ?? [];
  }
}
