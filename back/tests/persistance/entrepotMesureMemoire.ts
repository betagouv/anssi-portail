import { EntrepotMesure } from '../../src/metier/entrepotMesure.js';
import { Mesure } from '../../src/metier/mesure.js';
import { EntrepotMemoire } from './entrepotMemoire.js';

export class EntrepotMesureMemoire extends EntrepotMemoire<Mesure> implements EntrepotMesure {
  async parId(id: string): Promise<Mesure | undefined> {
    return this.entites.find((mesure) => mesure.id === id);
  }
}
