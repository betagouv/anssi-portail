import { Knex } from 'knex';
import {
  libellésNiveauMaturité,
  tousLesIdNiveauMaturite,
} from '../../metier/mini-tests/maturite-cyber/resultatTestMaturite.js';
import { CumulMensuel, SeuilCompletion, TotalParNiveauMaturite } from '../../metier/observatoire.js';
import { AdaptateurObservatoireMSC } from './adaptateurObservatoireMSC.js';

export class AdaptateurObservatoireMSCPostgres implements AdaptateurObservatoireMSC {
  constructor(private readonly knex: Knex) {}

  async totalTestsMaturite(): Promise<number> {
    return this.total(this.testsMaturite());
  }

  async testsMaturiteParNiveau(): Promise<TotalParNiveauMaturite[]> {
    const lignes = await this.testsMaturite()
      .select('niveau')
      .count<{ niveau: string; total: string }[]>('* as total')
      .whereNotNull('niveau')
      .groupBy('niveau')
      .orderByRaw('array_position(?::text[], niveau)', [
        tousLesIdNiveauMaturite.map((id) => libellésNiveauMaturité[id]),
      ]);
    return lignes.map(({ niveau, total }) => ({ niveau, total: Number(total) }));
  }

  async totalTestsSensibilisation(): Promise<number> {
    return this.total(this.knex('msc.tests_realises'));
  }

  async cumulMensuelTestsSensibilisation(): Promise<CumulMensuel[]> {
    return this.cumulMensuel(this.knex('msc.tests_realises').select('date_realisation as date'));
  }

  async totalParcoursRejoints(): Promise<number> {
    return this.total(this.knex('msc.parcours_rejoints'));
  }

  async totalCyberdepartsValides(): Promise<number> {
    return this.total(this.knex('msc.badges_cyberdepart'));
  }

  async cumulMensuelCyberdepartsValides(): Promise<CumulMensuel[]> {
    return this.cumulMensuel(this.knex('msc.badges_cyberdepart').select('date'));
  }

  async totalCompletions(seuil: SeuilCompletion): Promise<number> {
    return this.total(this.completions(seuil));
  }

  async cumulMensuelCompletions(seuil: SeuilCompletion): Promise<CumulMensuel[]> {
    return this.cumulMensuel(this.completions(seuil).select('date'));
  }

  async dateDerniereExecution(): Promise<Date | null> {
    const resultat = await this.knex('msc.executions').max<{ date: Date | null }>('date_execution as date').first();
    return resultat?.date ?? null;
  }

  private testsMaturite() {
    return this.knex('msc.tests_realises').where({ type_test: 'maturité cyber' });
  }

  private completions(seuil: SeuilCompletion) {
    return this.knex('msc.completions_parcours').where({ seuil });
  }

  private async total(lignes: Knex.QueryBuilder): Promise<number> {
    const [{ total }] = await lignes.count('* as total');
    return Number(total);
  }

  private async cumulMensuel(dates: Knex.QueryBuilder): Promise<CumulMensuel[]> {
    const { rows } = await this.knex.raw<{ rows: CumulMensuel[] }>(
      `
      WITH dates AS (?),
      total_par_mois AS (
        SELECT date_trunc('month', date) AS mois, COUNT(*) AS nombre
        FROM dates
        WHERE date IS NOT NULL
        GROUP BY 1
      ),
      mois AS (
        SELECT generate_series(MIN(mois), MAX(mois), interval '1 month') AS mois
        FROM total_par_mois
      )
      SELECT to_char(mois.mois, 'YYYY-MM') AS mois,
             (SUM(COALESCE(total_par_mois.nombre, 0)) OVER (ORDER BY mois.mois))::int AS cumul
      FROM mois
      LEFT JOIN total_par_mois ON total_par_mois.mois = mois.mois
      ORDER BY mois.mois
    `,
      [dates]
    );
    return rows;
  }
}
