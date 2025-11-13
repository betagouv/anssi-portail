import { Guide } from './guide';

export interface EntrepotGuide {
  tous: () => Promise<Guide[]>;
}
