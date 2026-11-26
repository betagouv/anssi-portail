import { EntrepôtModule } from '@metier/EntrepotModule.js';
import { Mesure } from '@metier/mesure.js';
import { Module } from '@metier/module.js';

import { EntrepotMemoire } from './entrepotMemoire.js';

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
