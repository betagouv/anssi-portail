import { EntrepôtModule } from '../../src/metier/EntrepotModule';
import { Module } from '../../src/metier/module';
import { EntrepotMemoire } from './entrepotMemoire';

export class EntrepôtModuleMémoire extends EntrepotMemoire<Module> implements EntrepôtModule {
  async parId(id: number): Promise<Module | undefined> {
    return this.entites.find((module) => module.id === id);
  }
}
