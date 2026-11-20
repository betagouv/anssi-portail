import { Knex } from 'knex';
import { AdaptateurObservatoire, CumulMensuel, FiltresObservatoire } from './adaptateurObservatoire.js';

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

  async cumulMensuelServices(_filtres: FiltresObservatoire): Promise<CumulMensuel[]> {
    const { rows } = await this.knex.raw<{ rows: CumulMensuel[] }>(`
      SELECT to_char(date_trunc('month', date_creation), 'YYYY-MM') AS mois,
             (SUM(COUNT(*)) OVER (ORDER BY date_trunc('month', date_creation)))::int AS cumul
      FROM mss.services_crees
      WHERE date_creation IS NOT NULL
      GROUP BY date_trunc('month', date_creation)
      ORDER BY date_trunc('month', date_creation)
    `);
    return rows;
  }
}
