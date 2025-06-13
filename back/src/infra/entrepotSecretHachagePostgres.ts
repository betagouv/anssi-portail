import Knex from 'knex';
import config from '../../knexfile';

export interface EntrepotSecretHachage {
  tous: () => Promise<{ version: number, empreinte: string }[]>;
}

export class EntrepotSecretHachagePostgres implements EntrepotSecretHachage {
  knex: Knex.Knex;

  constructor() {
    this.knex = Knex(config);
  }

  async tous(): Promise<{ version: number, empreinte: string }[]> {
    const empreintes = await this.knex('secrets_hachage');
    return empreintes.map(({version, empreinte}) => ({version, empreinte}));
  }
}
