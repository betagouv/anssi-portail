import { Article } from './article.js';
import { RésuméArticle } from './resumeArticle.js';

export interface EntrepôtArticle {
  articleDeBlogParSlug: (slug: string) => Promise<Article | undefined>;
  tousLesArticlesDeBlog: () => Promise<RésuméArticle[]>;
  articleDeBlogExiste: (slug: string) => Promise<boolean>;
  kitRelais: () => Promise<Article>;
}
