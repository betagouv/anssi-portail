import { EntrepotExigence } from '../../src/metier/EntrepotExigence';
import { Exigence } from '../../src/metier/Exigence';
import { EntrepotMemoire } from './entrepotMemoire';

export class EntrepotExigenceMemoire
  extends EntrepotMemoire<Exigence>
  implements EntrepotExigence
{
  parReferentiel(_referentiel: string): Promise<Exigence[]> {
    return this.tous();
  }
}
