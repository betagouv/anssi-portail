import { Mesure } from './mesure.js';
import { Module } from './module.js';

export interface EntrepôtModule {
  tous(): Promise<Module[]>;
  pourLaMesure(mesure: Mesure): Promise<Module>;
  parId(id: number): Promise<Module | undefined>;
}
