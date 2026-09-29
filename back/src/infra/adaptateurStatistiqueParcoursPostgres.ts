import Knex from 'knex';
import { AdaptateurStatistiqueParcours } from '../metier/adaptateurStatistiqueParcours.js';

export class AdaptateurStatistiqueParcoursPostgres implements AdaptateurStatistiqueParcours {
  private readonly knex: Knex.Knex;
  constructor() {
    const config = {
      client: 'pg',
      connection: process.env.BASE_DONNEES_JOURNAL_URL_SERVEUR,
      pool: {
        min: 0,
        max: Number.parseInt(process.env.BASE_DONNEES_JOURNAL_POOL_CONNEXION_MAX || '0'),
      },
    };
    this.knex = Knex(config);
  }

  async nombreDeParcoursDémarrés(): Promise<number> {
    const [{ total }] = await this.knex('evenements')
      .withSchema('journal_msc')
      .count('* as total')
      .where('type', 'PARCOURS_REJOINT');

    return Number(total);
  }
}
