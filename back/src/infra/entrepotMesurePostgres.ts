import Knex from 'knex';
import config from '../../knexfile';
import { EntrepotMesure } from '../metier/entrepotMesure';
import { Mesure } from '../metier/mesure';

export class EntrepotMesurePostgres implements EntrepotMesure {
  knex: Knex.Knex;

  constructor() {
    this.knex = Knex(config);
  }

  async parId(id: string): Promise<Mesure | undefined> {
    return this.knex<Mesure>('mesures').where({ id }).first();
  }
}
