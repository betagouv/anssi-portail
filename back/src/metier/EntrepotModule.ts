import { Mesure } from './mesure';
import { Module } from './module';

export interface EntrepôtModule {
  pourLaMesure(mesure: Mesure): Promise<Module>;
  parId(id: number): Promise<Module | undefined>;
}
