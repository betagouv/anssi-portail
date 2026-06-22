import Knex from 'knex';
import config from '../knexfile';
import { EntrepôtModule } from './metier/EntrepotModule';
import { Module } from './metier/module';

type ModulePersisté = { id: number; nom: string };

export class EntrepôtModulePostgres implements EntrepôtModule {
  knex: Knex.Knex;

  constructor() {
    this.knex = Knex(config);
  }

  async parId(id: number): Promise<Module | undefined> {
    const moduleLu = await this.knex<ModulePersisté>('modules').where({ id }).first();
    if (!moduleLu) {
      return undefined;
    }
    return new Module(moduleLu.id, moduleLu.nom);
  }
}
