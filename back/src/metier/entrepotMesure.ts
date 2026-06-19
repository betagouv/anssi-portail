import { Mesure } from './mesure';
import { Module } from './module';

export interface EntrepotMesure {
  parId(id: string): Promise<Mesure | undefined>;

  tous(): Promise<Mesure[]>;

  duModule(module: Module): Promise<Mesure[]>;
}
