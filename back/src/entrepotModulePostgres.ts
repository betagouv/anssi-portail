import Knex from 'knex';
import config from '../knexfile.js';
import { MesurePersistee } from './infra/entrepotMesurePostgres.js';
import { EntrepotMesure } from './metier/entrepotMesure.js';
import { EntrepôtModule } from './metier/EntrepotModule.js';
import { Mesure } from './metier/mesure.js';
import { Module } from './metier/module.js';

type ModulePersisté = { id: number; nom: string };

export class EntrepôtModulePostgres implements EntrepôtModule {
  knex: Knex.Knex;

  constructor(private entrepôtMesure: EntrepotMesure) {
    this.knex = Knex(config);
  }

  async parId(id: number): Promise<Module | undefined> {
    const moduleLu = await this.knex<ModulePersisté>('modules').where({ id }).first();
    if (!moduleLu) {
      return undefined;
    }

    return await this.réhydrate(moduleLu);
  }

  async pourLaMesure(mesure: Mesure): Promise<Module> {
    const moduleLu = await this.knex<ModulePersisté>('modules')
      .join('mesures', 'mesures.id_module', 'modules.id')
      .where({ 'mesures.id': mesure.id })
      .select('modules.*')
      .first();
    if (!moduleLu) {
      throw new Error(`Module non trouvé pour la mesure ${mesure.id}`);
    }
    return await this.réhydrate(moduleLu);
  }

  private async réhydrate(moduleLu: ModulePersisté) {
    const mesuresDuModuleLues = await this.knex<MesurePersistee>('mesures').where({ id_module: moduleLu.id });

    const mesuresDuModule = await Promise.all(mesuresDuModuleLues.map((m) => this.entrepôtMesure.parId(m.id)));
    const module = new Module(moduleLu.id, moduleLu.nom);
    module.mesures = mesuresDuModule.filter((m) => !!m);
    return module;
  }
}
