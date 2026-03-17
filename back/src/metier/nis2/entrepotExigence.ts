import { Exigence, Referentiel } from './exigence';

export interface EntrepotExigence {
  parReferentiel(referentiel: Referentiel, referentielCible?: Referentiel): Promise<Exigence[]>;
}
