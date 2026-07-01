import { Mesure } from './mesure.js';

export interface EntrepotMesure {
  parId(id: string): Promise<Mesure | undefined>;

  tous(): Promise<Mesure[]>;
}
