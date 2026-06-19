import { EntrepotMesure } from '../../src/metier/entrepotMesure';
import { Mesure } from '../../src/metier/mesure';
import { Module } from '../../src/metier/module';
import { EntrepotMemoire } from './entrepotMemoire';

export class EntrepotMesureMemoire extends EntrepotMemoire<Mesure> implements EntrepotMesure {
  async parId(id: string): Promise<Mesure | undefined> {
    return this.entites.find((mesure) => mesure.id === id);
  }

  async duModule(module: Module): Promise<Mesure[]> {
    return this.entites.filter((mesure) => mesure.module === module);
  }
}
