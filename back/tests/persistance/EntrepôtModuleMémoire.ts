import { EntrepôtModule } from '../../src/metier/EntrepotModule';
import { Mesure } from '../../src/metier/mesure';
import { Module } from '../../src/metier/module';
import { EntrepotMemoire } from './entrepotMemoire';

export class EntrepôtModuleMémoire extends EntrepotMemoire<Module> implements EntrepôtModule {
  async parId(id: number): Promise<Module | undefined> {
    if (Number.isNaN(id)) {
      throw new Error('pas un nombre');
    }
    return this.entites.find((module) => module.id === id);
  }

  async pourLaMesure(mesure: Mesure): Promise<Module> {
    const module = this.entites.find((module) => module.mesures.some((m) => m.id === mesure.id));
    return module!;
  }
}
