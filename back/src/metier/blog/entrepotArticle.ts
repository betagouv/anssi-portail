import { RésuméArticle } from './resumeArticle.js';

export interface EntrepôtArticle {
  tous: () => Promise<RésuméArticle[]>;
}
