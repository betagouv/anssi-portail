import { Financement } from './financement';

export interface EntrepotFinancement {
  tous: () => Promise<Financement[]>;
}
