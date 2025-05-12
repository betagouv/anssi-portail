import { EntrepotSessionDeGroupe } from '../metier/entrepotSessionDeGroupe';
import { SessionDeGroupe } from '../metier/sessionDeGroupe';
import Knex from 'knex';
import config from '../../knexfile';

export class EntrepotSessionDeGroupePostgres
  implements EntrepotSessionDeGroupe
{
  knex: Knex.Knex;

  constructor() {
    this.knex = Knex(config);
  }

  async tous(): Promise<SessionDeGroupe[]> {
    return this.knex('sessions_groupe');
  }

  async ajoute(sessionDeGroupe: SessionDeGroupe): Promise<void> {
    await this.knex('sessions_groupe').insert({
      code: sessionDeGroupe.code,
    });
  }
}
