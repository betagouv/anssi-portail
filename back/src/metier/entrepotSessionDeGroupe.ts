import { SessionDeGroupe } from './sessionDeGroupe.js';

export interface EntrepotSessionDeGroupe {
  tous: () => Promise<SessionDeGroupe[]>;

  ajoute(sessionDeGroupe: SessionDeGroupe): Promise<void>;

  parCode(code: string): Promise<SessionDeGroupe | undefined>;
}
