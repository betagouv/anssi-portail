import { Financement } from '../metier/financement.js';

export interface AdaptateurSourceExterne {
  parId(id: Financement['id']): Promise<Financement>;
}
