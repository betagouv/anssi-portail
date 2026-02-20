import { Exigence } from './Exigence';

export interface EntrepotExigence{
  parReferentiel(referentiel: string): Promise<Exigence[]>;
}