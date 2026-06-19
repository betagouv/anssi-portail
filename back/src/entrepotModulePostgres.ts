import Knex from 'knex';
import config from '../knexfile';
import { EntrepôtModule } from './metier/EntrepotModule';
import { Module } from './metier/module';

export class EntrepôtModulePostgres implements EntrepôtModule {
  knex: Knex.Knex;

  constructor() {
    this.knex = Knex(config);
  }

  async parId(id: number): Promise<Module | undefined> {
    const moduleLu = await this.knex<{ id: number; nom: string }>('modules').where({ id }).first();
    if (!moduleLu) {
      return undefined;
    }
    return new Module(moduleLu.id, moduleLu.nom);
  }
}
