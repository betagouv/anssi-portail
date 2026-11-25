import { Knex } from 'knex';
import { CumulMensuel, FiltresObservatoire, TotalMensuel, TotalParNiveauSecurite } from '../../metier/observatoire.js';
import { AdaptateurObservatoireMSS } from './adaptateurObservatoireMSS.js';
import { cumulMensuel, total } from './requetesObservatoire.js';

export class AdaptateurObservatoireMSSPostgres implements AdaptateurObservatoireMSS {
  constructor(private readonly knex: Knex) {}

  async totalServices(filtres: FiltresObservatoire): Promise<number> {
    return total(this.services(filtres));
  }

  async cumulMensuelServices(filtres: FiltresObservatoire): Promise<CumulMensuel[]> {
    return cumulMensuel(this.knex, this.services(filtres), 'date_creation');
  }

  async mesuresFaitesParMois(filtres: FiltresObservatoire): Promise<TotalMensuel[]> {
    const sql = `
      WITH services AS (:services)
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
      WITH services AS (:services)
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
      WITH services AS (:services)
      SELECT to_char(date - interval '1 month', 'YYYY-MM') AS mois,
             SUM(total_realisees)::int AS cumul
      FROM mss.homologations_realisees
      WHERE id_hash_service IN (SELECT id_hash FROM services)
      GROUP BY date
      ORDER BY date
    `;
    return this.requete<CumulMensuel>(sql, filtres);
  }

  async dateDerniereExecution(): Promise<Date | null> {
    const sql = `
      SELECT MAX(date_execution) AS "date"
      FROM mss.executions
    `;
    const [{ date }] = await this.requete<{ date: Date | null }>(sql, {});
    return date;
  }

  private services({ region, departement, secteurActivite, typeOrganisation }: FiltresObservatoire) {
    const criteres = {
      region,
      departement,
      secteur_activite: secteurActivite,
      type_organisation: typeOrganisation,
    };
    const criteresRenseignes = Object.fromEntries(
      Object.entries(criteres).filter(([, valeur]) => valeur !== undefined)
    );
    return this.knex('mss.services_crees').where(criteresRenseignes);
  }

  private async requete<T>(sql: string, filtres: FiltresObservatoire): Promise<T[]> {
    const { rows } = await this.knex.raw<{ rows: T[] }>(sql, { services: this.services(filtres) });
    return rows;
  }
}
