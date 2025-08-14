import { EntrepotFinancement } from '../../src/metier/entrepotFinancement';
import { Financement } from '../../src/metier/financement';
import { EntrepotMemoire } from './entrepotMemoire';

export class EntrepotFinancementMemoire
  extends EntrepotMemoire<Financement>
  implements EntrepotFinancement
{
  parId: (id: number) => Promise<Financement | undefined> = (_id: number) => {
    return Promise.resolve(undefined);
  };
}
