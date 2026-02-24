import { Exigence } from './exigence';

export interface EntrepotExigence {
  parReferentiel(referentiel: string): Promise<Exigence[]>;
}
