import { SessionDeGroupe } from './sessionDeGroupe';

export interface EntrepotSessionDeGroupe {
  tous: () => Promise<SessionDeGroupe[]>;

  ajoute(sessionDeGroupe: SessionDeGroupe): Promise<void>;
}
