import { Guide } from './guide.type';

export interface EntrepotGuide {
  tous: () => Promise<Guide[]>;
}
