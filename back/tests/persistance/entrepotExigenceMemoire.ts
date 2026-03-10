import { EntrepotExigence } from '../../src/metier/nis2/entrepotExigence';
import {
  Exigence,
  ExigenceAE,
  ExigenceISO,
  ExigenceNIS2,
} from '../../src/metier/nis2/exigence';
import { EntrepotMemoire } from './entrepotMemoire';

export class EntrepotExigenceMemoire
  extends EntrepotMemoire<Exigence>
  implements EntrepotExigence
{
  parReferentiel(referentiel: 'NIS2'): Promise<ExigenceNIS2[]>;
  parReferentiel(referentiel: 'ISO'): Promise<ExigenceISO[]>;
  parReferentiel(referentiel: 'AE'): Promise<ExigenceAE[]>;
  parReferentiel(_referentiel: string) {
    return this.tous();
  }
}
