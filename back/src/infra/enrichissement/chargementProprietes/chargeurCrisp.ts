import { JSDOM } from 'jsdom';
import { EntrepôtArticle } from '../../../metier/blog/entrepotArticle.js';
import { ChargeurDeProps } from './chargeurDeProps.js';

export class ChargeurCrisp implements ChargeurDeProps {
  constructor(private readonly entrepôtArticle: EntrepôtArticle) {}

  async charge(_dom: JSDOM, routeDemandée: string) {
    if (routeDemandée.match(/conseils-cyber$/)) {
      const résumésPréchargés = await this.entrepôtArticle.tous();
      return { résumésPréchargés };
    }
  }
}
