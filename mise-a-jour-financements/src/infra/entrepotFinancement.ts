import { Financement } from '../metier/financement.js';

export interface EntrepotFinancement {
  tous(): Promise<Financement[]>;
}
