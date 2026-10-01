import { Article } from '../../src/metier/blog/article.js';
import { EntrepôtArticle } from '../../src/metier/blog/entrepotArticle.js';
import { RésuméArticle } from '../../src/metier/blog/resumeArticle.js';

export class EntrepôtArticleMémoire implements EntrepôtArticle {
  articles: Article[] = [];

  async ajoute(entite: Article) {
    this.articles.push(entite);
  }

  tous = async () =>
    [...this.articles].map((a) => ({ id: a.id, slug: a.slug, titre: a.titre }) satisfies RésuméArticle);

  parSlug = async (slug: string) => this.articles.find((a) => a.slug === slug);

  taille = async () => this.articles.length;
}
