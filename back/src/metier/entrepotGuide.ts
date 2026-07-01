import { Guide } from './guide.js';

export interface EntrepotGuide {
  parCollections(collections: string[]): Promise<Guide[]>;
  parId(id: string): Promise<Guide | undefined>;
  tous(): Promise<Guide[]>;
}
