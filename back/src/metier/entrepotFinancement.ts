import { Financement } from './financement';

export interface EntrepotFinancement {
  tous: () => Promise<Financement[]>;
  parId: (id: number) => Promise<Financement | undefined>;
}
