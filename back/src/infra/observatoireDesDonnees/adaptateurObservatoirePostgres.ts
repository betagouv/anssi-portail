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
      WITH crees_par_mois AS (
        SELECT date_trunc('month', date_creation) AS mois, COUNT(*) AS nombre
        FROM mss.services_crees
        WHERE date_creation IS NOT NULL
        GROUP BY 1
      ),
      mois AS (
        SELECT generate_series(MIN(mois), MAX(mois), interval '1 month') AS mois
        FROM crees_par_mois
      )
      SELECT to_char(mois.mois, 'YYYY-MM') AS mois,
             (SUM(COALESCE(crees_par_mois.nombre, 0)) OVER (ORDER BY mois.mois))::int AS cumul
      FROM mois
      LEFT JOIN crees_par_mois ON crees_par_mois.mois = mois.mois
      ORDER BY mois.mois
    `);
    return rows;
  }
}
