import { Article } from '../../src/metier/blog/article.js';
import { EntrepôtArticle } from '../../src/metier/blog/entrepotArticle.js';
import { RésuméArticle } from '../../src/metier/blog/resumeArticle.js';

type ArticleAvecToutesLesMétadonnées = Article & RésuméArticle;

export class EntrepôtArticleMémoire implements EntrepôtArticle {
  articles: ArticleAvecToutesLesMétadonnées[] = [];

  async ajoute(entite: ArticleAvecToutesLesMétadonnées) {
    this.articles.push(entite);
  }

  tous = async (): Promise<RésuméArticle[]> =>
    [...this.articles].map((a) => ({ id: a.id, slug: a.slug, titre: a.titre }));

  parSlug = async (slug: string) => this.articles.find((a) => a.slug === slug);

  taille = async () => this.articles.length;
}
