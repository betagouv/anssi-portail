import { Knex } from 'knex';
import { AdaptateurObservatoire, CumulMensuel, FiltresObservatoire } from './adaptateurObservatoire.js';

const SERVICES_FILTRES = `
  SELECT *
  FROM mss.services_crees
  WHERE (:region::text IS NULL OR region = :region)
    AND (:departement::text IS NULL OR departement = :departement)
    AND (:secteurActivite::text IS NULL OR secteur_activite = :secteurActivite)
    AND (:typeOrganisation::text IS NULL OR type_organisation = :typeOrganisation)
`;

export class AdaptateurObservatoirePostgres implements AdaptateurObservatoire {
  constructor(private readonly knex: Knex) {}

  async totalServices(filtres: FiltresObservatoire): Promise<number> {
    const sql = `
      WITH services AS (${SERVICES_FILTRES})
      SELECT COUNT(*)::int AS total
      FROM services
    `;
    const [{ total }] = await this.requete<{ total: number }>(sql, filtres);
    return total;
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

  private async requete<T>(sql: string, filtres: FiltresObservatoire): Promise<T[]> {
    const parametres = {
      region: filtres.region ?? null,
      departement: filtres.departement ?? null,
      secteurActivite: filtres.secteurActivite ?? null,
      typeOrganisation: filtres.typeOrganisation ?? null,
    };
    const { rows } = await this.knex.raw<{ rows: T[] }>(sql, parametres);
    return rows;
  }
}
