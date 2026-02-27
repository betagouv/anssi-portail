import { Exigence, ExigenceISO, ExigenceNIS2, Referentiel } from './exigence';

export interface EntrepotExigence {
  parReferentiel(
    referentiel: 'NIS2',
    referentielCible?: Referentiel
  ): Promise<ExigenceNIS2[]>;
  parReferentiel(
    referentiel: 'ISO',
    referentielCible?: Referentiel
  ): Promise<ExigenceISO[]>;
  parReferentiel(
    referentiel: Referentiel,
    referentielCible?: Referentiel
  ): Promise<Exigence[]>;
}
