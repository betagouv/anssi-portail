import { Exigence, ExigenceNIS2, Referentiel } from './exigence';

export interface EntrepotExigence {
  parReferentiel(referentiel: 'NIS2'): Promise<ExigenceNIS2[]>;
  parReferentiel(referentiel: Referentiel, referentielCible?: Referentiel): Promise<Exigence[]>;
}
