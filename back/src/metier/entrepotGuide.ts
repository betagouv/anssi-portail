import { Guide } from './guide';

export interface EntrepotGuide {
  parId(id: string): Promise<Guide | undefined>;
  tous: () => Promise<Guide[]>;
}
