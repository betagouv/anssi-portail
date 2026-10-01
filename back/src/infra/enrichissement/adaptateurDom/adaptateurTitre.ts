import { JSDOM } from 'jsdom';
import { RésolveurDePage } from '../resolveurDePage.js';
import { AdaptateurDom } from './adaptateurDom.js';

export class AdaptateurTitre implements AdaptateurDom {
  constructor(private readonly résolveurDePage: RésolveurDePage) {}

  async adapte(dom: JSDOM, routeDemandée: string) {
    const promesseGuide = this.résolveurDePage.guide(routeDemandée);
    const promesseFinancement = this.résolveurDePage.financement(routeDemandée);
    const promesseArticle = this.résolveurDePage.articleCrisp(routeDemandée);

    const [guideTrouvé, financementTrouvé, articleTrouvé] = await Promise.all([
      promesseGuide,
      promesseFinancement,
      promesseArticle,
    ]);

    let nouveauTitre: string | undefined = undefined;

    if (guideTrouvé) {
      nouveauTitre = guideTrouvé.langue === 'EN' ? `${guideTrouvé.nom} (EN)` : guideTrouvé.nom;
    } else if (financementTrouvé) {
      nouveauTitre = `${financementTrouvé.nom} (${financementTrouvé.perimetresGeographiques})`;
    } else if (articleTrouvé) {
      nouveauTitre = articleTrouvé.titre;
    }

    const titre = dom.window.document.getElementsByTagName('title').item(0);
    if (titre && nouveauTitre) {
      titre.innerHTML = `${nouveauTitre} | MesServicesCyber`;
    }
  }
}
