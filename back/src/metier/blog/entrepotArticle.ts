import { RésuméArticle } from './RésuméArticle.js';

export interface EntrepôtArticle {
  tous: () => Promise<RésuméArticle[]>;
}
