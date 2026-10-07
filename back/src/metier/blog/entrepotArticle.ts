import { Article } from './article.js';
import { RésuméArticle } from './resumeArticle.js';

export interface EntrepôtArticle {
  parSlug: (slug: string) => Promise<Article | undefined>;
  tous: () => Promise<RésuméArticle[]>;
  existe: (slug: string) => Promise<boolean>;
}
