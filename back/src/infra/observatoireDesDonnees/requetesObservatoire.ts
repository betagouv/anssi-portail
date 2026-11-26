import { Knex } from 'knex';

import { CumulMensuel } from '@metier/observatoire.js';

export const total = async (lignes: Knex.QueryBuilder): Promise<number> => {
  const [{ nombre }] = await lignes.count('* as nombre');
  return Number(nombre);
};

export const cumulMensuel = async (
  knex: Knex,
  lignes: Knex.QueryBuilder,
  colonneDate: string
): Promise<CumulMensuel[]> => {
  const sql = `
    WITH dates AS (:dates),
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
  `;
  const { rows } = await knex.raw<{ rows: CumulMensuel[] }>(sql, { dates: lignes.select({ date: colonneDate }) });
  return rows;
};
