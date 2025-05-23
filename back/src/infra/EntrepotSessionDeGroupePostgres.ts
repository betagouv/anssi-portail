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
    const sessions = await this.knex('sessions_groupe');
    return sessions.map((d) => (new SessionDeGroupe(d.code)));
  }

  async ajoute(sessionDeGroupe: SessionDeGroupe): Promise<void> {
    await this.knex('sessions_groupe').insert({
      code: sessionDeGroupe.code,
    });
  }

  async parCode(code: string): Promise<SessionDeGroupe | undefined> {
    const donneesSession = await this.knex('sessions_groupe').where({ code }).first();
    if (!donneesSession) {
      return undefined;
    }
    return new SessionDeGroupe(donneesSession.code);
  }
}
