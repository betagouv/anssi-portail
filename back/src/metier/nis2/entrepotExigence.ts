import { ExigenceISO, ExigenceNIS2 } from './exigence';

export interface EntrepotExigence {
  parReferentiel(referentiel: 'NIS2'): Promise<ExigenceNIS2[]>;
  parReferentiel(referentiel: 'ISO'): Promise<ExigenceISO[]>;
}
