import { EntrepotMesure } from '../metier/entrepotMesure';
import { Mesure } from '../metier/mesure';

export class EntrepotMesurePostgres implements EntrepotMesure {
  parId(_id: string): Promise<Mesure | undefined> {
    throw new Error('Method not implemented.');
  }
}
