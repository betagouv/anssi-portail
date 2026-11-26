import { EntrepotSessionDeGroupe } from '@metier/mini-tests/maturite-cyber/entrepotSessionDeGroupe.js';
import { SessionDeGroupe } from '@metier/mini-tests/maturite-cyber/sessionDeGroupe.js';
import { EntrepotMemoire } from './entrepotMemoire.js';

export class EntrepotSessionDeGroupeMemoire
  extends EntrepotMemoire<SessionDeGroupe>
  implements EntrepotSessionDeGroupe
{
  parCode = async (code: string): Promise<SessionDeGroupe | undefined> => this.entites.find((e) => e.code === code);
}
