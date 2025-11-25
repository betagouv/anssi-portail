import { Guide } from './guide';

export interface EntrepotGuide {
  parCollections(colelctions: string[]): Promise<Guide[]>;
  parId(id: string): Promise<Guide | undefined>;
  tous: () => Promise<Guide[]>;
}
