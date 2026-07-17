import { JSDOM } from 'jsdom';
import { AdaptateurDom } from './adaptateurDom.js';

export class AdaptateurLienCanonique implements AdaptateurDom {
  adapte(dom: JSDOM, routeDemandée: string) {
    const lienCanonique = dom.window.document.querySelector('link[rel="canonical"]');
    if (!lienCanonique) {
      return;
    }

    const href = lienCanonique.getAttribute('href') ?? '';
    const nouveauHref = href.replace(/\/(financements|guides)$/, routeDemandée);
    lienCanonique.setAttribute('href', nouveauHref);
  }
}
