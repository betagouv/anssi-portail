import { JSDOM } from 'jsdom';
import { AdaptateurDom } from './adaptateurDom.js';
import { RésolveurDePage } from '../résolveurDePage.js';

export class AdaptateurTitre implements AdaptateurDom {
  constructor(private readonly résolveurDePage: RésolveurDePage) {}

  async adapte(dom: JSDOM, routeDemandée: string) {
    const guideTrouvé = await this.résolveurDePage.guide(routeDemandée);
    const financementTrouvé = await this.résolveurDePage.financement(routeDemandée);
    const nouveauTitre = guideTrouvé?.nom ?? financementTrouvé?.nom;

    const titre = dom.window.document.getElementsByTagName('title').item(0);
    if (titre && nouveauTitre) {
      titre.innerHTML = `${nouveauTitre} | MesServicesCyber`;
    }
  }
}
