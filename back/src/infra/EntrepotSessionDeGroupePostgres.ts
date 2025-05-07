import { EntrepotSessionDeGroupe } from '../metier/entrepotSessionDeGroupe';
import { SessionDeGroupe } from '../metier/sessionDeGroupe';

export class EntrepotSessionDeGroupePostgres
  implements EntrepotSessionDeGroupe
{
  async tous(): Promise<SessionDeGroupe[]> {
    throw new Error('Non implémentée');
  }

  async ajoute(_sessionDeGroupe: SessionDeGroupe): Promise<void> {
    throw new Error('Non implémentée');
  }
}
