import { Financement } from './financement.js';

export interface EntrepotFinancement {
  tous: () => Promise<Financement[]>;
  parId: (id: number) => Promise<Financement | undefined>;
}
