import { JSDOM } from 'jsdom';
import { ChargeurDeProps } from './chargeurDeProps.js';

export class ChargeurFilAriane implements ChargeurDeProps {
  constructor() {}

  async charge(dom: JSDOM) {
    const donnees = dom.window.document.getElementById('donnees-fil-ariane')?.textContent;
    if (!donnees) {
      return;
    }
    const { feuille } = JSON.parse(donnees);
    return { feuille };
  }
}
