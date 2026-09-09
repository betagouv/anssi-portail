import { JSDOM } from 'jsdom';
import { AdaptateurDom } from './adaptateurDom.js';
import { RésolveurDePage } from '../résolveurDePage.js';

export class AdaptateurTitre implements AdaptateurDom {
  constructor(private readonly résolveurDePage: RésolveurDePage) {}

  async adapte(dom: JSDOM, routeDemandée: string) {
    const promesseGuide = this.résolveurDePage.guide(routeDemandée);
    const promesseFinancement = this.résolveurDePage.financement(routeDemandée);

    await Promise.all([promesseGuide, promesseFinancement]);
    const guideTrouvé = await promesseGuide;
    const financementTrouvé = await promesseFinancement;

    let nouveauTitre: string | undefined = undefined;

    if (guideTrouvé) {
      nouveauTitre = guideTrouvé.langue === 'EN' ? `${guideTrouvé.nom} (EN)` : guideTrouvé.nom;
    } else if (financementTrouvé) {
      nouveauTitre = `${financementTrouvé.nom} (${financementTrouvé.perimetresGeographiques})`;
    }

    const titre = dom.window.document.getElementsByTagName('title').item(0);
    if (titre && nouveauTitre) {
      titre.innerHTML = `${nouveauTitre} | MesServicesCyber`;
    }
  }
}
