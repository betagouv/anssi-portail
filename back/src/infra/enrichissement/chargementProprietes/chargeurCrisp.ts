import { JSDOM } from 'jsdom';
import { EntrepôtArticle } from '../../../metier/blog/entrepotArticle.js';
import { RésolveurDePage } from '../resolveurDePage.js';
import { ChargeurDeProps } from './chargeurDeProps.js';

export class ChargeurCrisp implements ChargeurDeProps {
  constructor(
    private readonly résolveurDePage: RésolveurDePage,
    private readonly entrepôtArticle: EntrepôtArticle
  ) {}

  async charge(_dom: JSDOM, routeDemandée: string) {
    if (routeDemandée.match(/conseils-cyber$/)) {
      const résumésPréchargés = await this.entrepôtArticle.tous();
      return { résumésPréchargés };
    }

    const articlePréchargé = await this.résolveurDePage.articleCrisp(routeDemandée);
    if (articlePréchargé) {
      return { articlePréchargé };
    }
  }
}
