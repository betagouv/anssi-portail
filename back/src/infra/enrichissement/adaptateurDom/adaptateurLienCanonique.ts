import { JSDOM } from 'jsdom';
import { AdaptateurDom } from './adaptateurDom.js';

export class AdaptateurLienCanonique implements AdaptateurDom {
  private readonly motifRoutes: RegExp;

  constructor(private readonly routesRacines: string[]) {
    const alternatives = routesRacines.map((route) => route.replace(/^\//, '')).join('|');
    this.motifRoutes = new RegExp(`/(${alternatives})$`);
  }

  adapte(dom: JSDOM, routeDemandée: string) {
    const lienCanonique = dom.window.document.querySelector('link[rel="canonical"]');
    if (!lienCanonique) {
      return;
    }

    const href = lienCanonique.getAttribute('href') ?? '';
    const nouveauHref = href.replace(this.motifRoutes, routeDemandée);
    lienCanonique.setAttribute('href', nouveauHref);
  }
}
