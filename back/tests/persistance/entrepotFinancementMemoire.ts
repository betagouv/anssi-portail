import { EntrepotFinancement } from '../../src/metier/entrepotFinancement.js';
import { Financement } from '../../src/metier/financement.js';
import { EntrepotMemoire } from './entrepotMemoire.js';

export class EntrepotFinancementMemoire extends EntrepotMemoire<Financement> implements EntrepotFinancement {
  parId: (id: number) => Promise<Financement | undefined> = async (id: number) => {
    return this.entites.find((entite) => entite.id === id);
  };
}
