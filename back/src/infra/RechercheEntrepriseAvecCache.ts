import {
  AdaptateurRechercheEntreprise,
  ResultatRechercheEntreprise,
} from './adaptateurRechercheEntreprise';
import { Cache } from './cache';

const TRENTE_MINUTES = 60 * 30;

export class RechercheEntrepriseAvecCache
  implements AdaptateurRechercheEntreprise
{
  cache: Cache<ResultatRechercheEntreprise[]>;

  constructor(private adaptateurDecore: AdaptateurRechercheEntreprise) {
    this.cache = new Cache({ ttl: TRENTE_MINUTES });
  }

  async rechercheOrganisations(
    terme: string,
    departement: string | null
  ): Promise<ResultatRechercheEntreprise[]> {
    return this.cache.get(`${terme}-${departement}`, () =>
      this.adaptateurDecore.rechercheOrganisations(terme, departement)
    );
  }
}
