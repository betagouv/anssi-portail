import { ClientHttp } from './clientHttp';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement';
import { Cache } from './cache';

export type ReponseGrist<TYPE_DOCUMENT> = {
  records: TYPE_DOCUMENT[];
};

type Filtre = Record<string, unknown[]>;

export class EntrepotGrist<TYPE_DOCUMENT> {
  private readonly urlDeBase: string;
  private readonly cleApi: string;
  private cache: Cache<Promise<ReponseGrist<TYPE_DOCUMENT>>>;

  constructor(
    private readonly adaptateurEnvironnement: AdaptateurEnvironnement,
    private readonly clientHttp: ClientHttp<ReponseGrist<TYPE_DOCUMENT>>
  ) {
    const grist = this.adaptateurEnvironnement.grist();
    this.urlDeBase = grist.urlGuides();
    this.cleApi = grist.cleApiGuides();
    this.cache = new Cache({ ttl: grist.dureeCacheEnSecondes() });
  }

  protected async appelleGrist(filtre?: Filtre) {
    const url = filtre
      ? `${this.urlDeBase}?filter=${encodeURIComponent(JSON.stringify(filtre))}`
      : this.urlDeBase;
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

  protected aseptiseListe<T>(colonne: T[] | null | undefined): T[] {
    return colonne?.slice(1) ?? [];
  }
}
