import { Article } from '../../metier/blog/article.js';
import { EntrepôtArticle } from '../../metier/blog/entrepotArticle.js';
import { EntrepotFinancement } from '../../metier/entrepotFinancement.js';
import { EntrepotGuide } from '../../metier/entrepotGuide.js';

export class RésolveurDePage {
  constructor(
    private readonly entrepotGuide: EntrepotGuide,
    private readonly entrepôtFinancement: EntrepotFinancement,
    private readonly entrepôtArticle: EntrepôtArticle
  ) {}

  async guide(routeDemandée: string) {
    const idGuide = routeDemandée.match(/\/guides\/(.*)/)?.[1];
    if (!idGuide) {
      return;
    }
    return (await this.entrepotGuide.tous()).find((g) => g.id === idGuide);
  }

  async financement(routeDemandée: string) {
    const idFinancement = routeDemandée.match(/\/financements\/(.*)/)?.[1];
    if (idFinancement) {
      return this.entrepôtFinancement.parId(Number(idFinancement));
    }
  }

  async articleCrisp(routeDemandée: string): Promise<Article | undefined> {
    const slugArticle = routeDemandée.match(/\/conseils-cyber\/(.*)/)?.[1];
    if (slugArticle) {
      return this.entrepôtArticle.parSlug(slugArticle);
    }
  }
}
