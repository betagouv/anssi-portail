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

type OptionsAppelGrist = { filtre?: Filtre; tri?: Tri; sansCache?: boolean };

type ValeurGrist = string | number | boolean | string[];

export class EntrepotGrist<TYPE_DOCUMENT> {
  private readonly cache: Cache<ReponseGrist<TYPE_DOCUMENT>>;

  constructor(
    private readonly clientHttp: ClientHttp,
    private readonly urlDeBase: string,
    private readonly cleApi: string,
    dureeCacheEnSecondes: number
  ) {
    this.cache = new Cache({ ttl: dureeCacheEnSecondes });
  }

  protected appelleGrist(options: OptionsAppelGrist = {}, urlPreConstruite?: string) {
    if (!this.urlDeBase && !urlPreConstruite) {
      return { records: [] };
    }

    const url = urlPreConstruite ?? this.construisUrl(options);
    const appelleGristSansCache = async () => {
      const reponse = await this.clientHttp.get<ReponseGrist<TYPE_DOCUMENT>>(url.toString(), {
        headers: {
          authorization: `Bearer ${this.cleApi}`,
          accept: 'application/json',
        },
      });
      return reponse.data;
    };

    if (options.sansCache) {
      return appelleGristSansCache();
    }

    return this.cache.get(url, async () => {
      return await appelleGristSansCache();
    });
  }

  protected async modifieEnregistrementGrist(
    colonneId: string,
    valeurId: string,
    valeurs: Record<string, ValeurGrist>
  ) {
    await this.clientHttp.put(
      `${this.urlDeBase}?noadd=true&onmany=none`,
      {
        records: [
          {
            require: {
              [colonneId]: valeurId, // WHERE
            },
            fields: valeurs, // SET
          },
        ],
      },
      {
        headers: {
          authorization: `Bearer ${this.cleApi}`,
          accept: 'application/json',
        },
      }
    );
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
