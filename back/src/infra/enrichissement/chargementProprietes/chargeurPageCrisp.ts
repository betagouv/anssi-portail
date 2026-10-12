import { JSDOM } from 'jsdom';
import { EntrepôtArticle } from '../../../metier/blog/entrepotArticle.js';
import { ChargeurDeProps } from './chargeurDeProps.js';

export class ChargeurPageCrisp implements ChargeurDeProps {
  constructor(private readonly entrepôtArticle: EntrepôtArticle) {}

  async charge(_dom: JSDOM, routeDemandée: string) {
    const chemin = new URL(routeDemandée, 'http://localhost').pathname;
    const slug = chemin.split('/').filter(Boolean).at(-1);
    if (!slug || slug !== 'kit-relais') return;

    const { titre, tableDesMatières, description, contenu } = await this.entrepôtArticle.kitRelais();
    return {
      pageCrisp: { titre, description, contenu, tableDesMatières },
    };
  }
}
