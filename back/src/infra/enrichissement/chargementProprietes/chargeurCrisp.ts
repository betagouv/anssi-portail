import { CmsCrisp } from '@lab-anssi/lib';
import { JSDOM } from 'jsdom';
import { ChargeurDeProps } from './chargeurDeProps.js';

export class ChargeurCrisp implements ChargeurDeProps {
  constructor(private readonly cmsCrisp: CmsCrisp) {}

  async charge(dom: JSDOM) {
    const données = dom.window.document.getElementById('donnees-page-crisp')?.textContent;
    if (!données) {
      return;
    }

    const { clePageCrisp } = JSON.parse(données);
    if (!clePageCrisp) {
      return;
    }

    const pageCrispInitiale = await this.cmsCrisp.recupereArticle(clePageCrisp);
    return { pageCrispInitiale };
  }
}
