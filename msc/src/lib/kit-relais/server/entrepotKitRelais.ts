import type { KitRelais } from '../kitRelais.js';

export interface EntrepotKitRelais {
  lis(): Promise<KitRelais | undefined>;
}
