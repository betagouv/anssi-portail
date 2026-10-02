import DOMPurify from 'isomorphic-dompurify';
import { JSDOM } from 'jsdom';
import { RésolveurDePage } from '../resolveurDePage.js';
import { AdaptateurDom } from './adaptateurDom.js';

export interface FournisseurDeMétadonnées {
  description(routeDemandée: string): Promise<string | undefined>;
}

export class MétadonnéesDeGuide implements FournisseurDeMétadonnées {
  constructor(private readonly résolveurDePage: RésolveurDePage) {}

  async description(route: string) {
    const guide = await this.résolveurDePage.guide(route);
    if (!guide) return undefined;

    return DOMPurify.sanitize(guide.description, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });
  }
}

export class MétadonnéesDeFinancement implements FournisseurDeMétadonnées {
  constructor(private readonly résolveurDePage: RésolveurDePage) {}

  async description(route: string) {
    const financement = await this.résolveurDePage.financement(route);
    return financement ? `${financement.nom} (${financement.perimetresGeographiques})` : undefined;
  }
}

export class MétadonnéesDArticleCrisp implements FournisseurDeMétadonnées {
  constructor(private readonly résolveurDePage: RésolveurDePage) {}

  async description(route: string) {
    const article = await this.résolveurDePage.articleCrisp(route);
    return article?.description;
  }
}

export class AdaptateurMétadonnées implements AdaptateurDom {
  constructor(private readonly fournisseurs: FournisseurDeMétadonnées[]) {}

  async adapte(dom: JSDOM, routeDemandée: string) {
    const descriptions = await Promise.all(this.fournisseurs.map((f) => f.description(routeDemandée)));
    const description = descriptions.find((t) => t !== undefined);
    if (!description) {
      return;
    }

    dom.window.document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    dom.window.document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    dom.window.document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description);
  }
}
