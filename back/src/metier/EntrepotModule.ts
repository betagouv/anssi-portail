import { Mesure } from './mesure.js';
import { Module } from './module.js';

export interface EntrepôtModule {
  pourLaMesure(mesure: Mesure): Promise<Module>;
  parId(id: number): Promise<Module | undefined>;
}
