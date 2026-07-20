import { CmsCrisp } from '@lab-anssi/lib';
import { JSDOM } from 'jsdom';
import { ChargeurDeProps } from './chargeurDeProps.js';
import { AdaptateurEnvironnement } from '../../adaptateurEnvironnement.js';

export class ChargeurCrisp implements ChargeurDeProps {
  constructor(
    private readonly cmsCrisp: CmsCrisp,
    private readonly adaptateurEnvironnement: AdaptateurEnvironnement
  ) {}

  async charge(dom: JSDOM) {
    const données = dom.window.document.getElementById('donnees-page-crisp')?.textContent;
    if (!données) {
      return;
    }

    const { clePageCrisp } = JSON.parse(données);
    if (!clePageCrisp) {
      return;
    }

    const idArticle = this.adaptateurEnvironnement.crisp().idArticle(clePageCrisp.toUpperCase());
    if (!idArticle) {
      return;
    }

    const pageCrispInitiale = await this.cmsCrisp.recupereArticle(idArticle);
    return { pageCrispInitiale };
  }
}
