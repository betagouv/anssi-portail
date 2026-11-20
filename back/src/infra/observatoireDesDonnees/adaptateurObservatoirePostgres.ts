import { Knex } from 'knex';
import { AdaptateurObservatoire, FiltresObservatoire } from './adaptateurObservatoire.js';

export class AdaptateurObservatoirePostgres implements AdaptateurObservatoire {
  constructor(private readonly knex: Knex) {}

  async totalServices(filtres: FiltresObservatoire): Promise<number> {
    const [{ total }] = await this.knex('mss.services_crees')
      .modify((requete) => {
        if (filtres.region) requete.where('region', filtres.region);
      })
      .count<{ total: string }[]>('* as total');
    return Number(total);
  }
}
