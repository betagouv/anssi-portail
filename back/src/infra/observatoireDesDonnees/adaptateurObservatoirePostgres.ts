import { Knex } from 'knex';
import {
  AdaptateurObservatoire,
  CumulMensuel,
  FiltresObservatoire,
  TotalMensuel,
  TotalParNiveauSecurite,
} from './adaptateurObservatoire.js';

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

  async cumulMensuelServices(filtres: FiltresObservatoire): Promise<CumulMensuel[]> {
    const sql = `
      WITH services AS (${SERVICES_FILTRES}),
      crees_par_mois AS (
        SELECT date_trunc('month', date_creation) AS mois, COUNT(*) AS nombre
        FROM services
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
    `;
    return this.requete<CumulMensuel>(sql, filtres);
  }

  async mesuresFaitesParMois(filtres: FiltresObservatoire): Promise<TotalMensuel[]> {
    const sql = `
      WITH services AS (${SERVICES_FILTRES})
      SELECT to_char(date - interval '1 month', 'YYYY-MM') AS mois,
             SUM(total_faites)::int AS total
      FROM mss.mesures_faites
      WHERE id_hash_service IN (SELECT id_hash FROM services)
      GROUP BY date
      ORDER BY date
    `;
    return this.requete<TotalMensuel>(sql, filtres);
  }

  async servicesParNiveauSecurite(filtres: FiltresObservatoire): Promise<TotalParNiveauSecurite[]> {
    const sql = `
      WITH services AS (${SERVICES_FILTRES})
      SELECT niveau_securite AS "niveauSecurite",
             COUNT(*)::int AS total
      FROM services
      WHERE niveau_securite IS NOT NULL
      GROUP BY niveau_securite
      ORDER BY CASE niveau_securite
                 WHEN 'Élémentaires' THEN 1
                 WHEN 'Modérés' THEN 2
                 WHEN 'Importants' THEN 3
               END
    `;
    return this.requete<TotalParNiveauSecurite>(sql, filtres);
  }

  async cumulMensuelHomologations(filtres: FiltresObservatoire): Promise<CumulMensuel[]> {
    const sql = `
      WITH services AS (${SERVICES_FILTRES})
      SELECT to_char(date - interval '1 month', 'YYYY-MM') AS mois,
             SUM(total_realisees)::int AS cumul
      FROM mss.homologations_realisees
      WHERE id_hash_service IN (SELECT id_hash FROM services)
      GROUP BY date
      ORDER BY date
    `;
    return this.requete<CumulMensuel>(sql, filtres);
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
