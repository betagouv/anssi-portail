import { Financement } from './financement.type';

export interface EntrepotFinancement {
  tous: () => Promise<Financement[]>;
  empreinte: () => Promise<string>;
}
