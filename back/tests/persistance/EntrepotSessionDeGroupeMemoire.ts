import { EntrepotSessionDeGroupe } from '../../src/metier/entrepotSessionDeGroupe.js';
import { EntrepotMemoire } from './entrepotMemoire.js';
import { SessionDeGroupe } from '../../src/metier/sessionDeGroupe.js';

export class EntrepotSessionDeGroupeMemoire
  extends EntrepotMemoire<SessionDeGroupe>
  implements EntrepotSessionDeGroupe
{
  parCode = async (code: string): Promise<SessionDeGroupe | undefined> => this.entites.find((e) => e.code === code);
}
