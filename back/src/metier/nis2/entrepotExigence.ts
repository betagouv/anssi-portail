import { Exigence, ExigenceISO, ExigenceNIS2, Referentiel } from './exigence';

export interface EntrepotExigence {
  parReferentiel(referentiel: 'NIS2'): Promise<ExigenceNIS2[]>;
  parReferentiel(referentiel: 'ISO'): Promise<ExigenceISO[]>;
  parReferentiel(referentiel: Referentiel): Promise<Exigence[]>;
}
