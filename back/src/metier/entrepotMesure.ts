import { Mesure } from './mesure';

export interface EntrepotMesure {
  parId(id: string): Promise<Mesure | undefined>;
}
