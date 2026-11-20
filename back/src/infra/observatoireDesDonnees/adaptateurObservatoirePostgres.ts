import { Knex } from 'knex';
import { AdaptateurObservatoire, FiltresObservatoire } from './adaptateurObservatoire.js';

export class AdaptateurObservatoirePostgres implements AdaptateurObservatoire {
  constructor(private readonly knex: Knex) {}

  async totalServices(filtres: FiltresObservatoire): Promise<number> {
    const [{ total }] = await this.knex('mss.services_crees')
      .modify((requete) => {
        const { departement, region, secteurActivite, typeOrganisation } = filtres;
        if (region) requete.where('region', region);
        if (departement) requete.where('departement', departement);
        if (secteurActivite) requete.where('secteur_activite', secteurActivite);
        if (typeOrganisation) requete.where('type_organisation', typeOrganisation);
      })
      .count<{ total: string }[]>('* as total');
    return Number(total);
  }
}
