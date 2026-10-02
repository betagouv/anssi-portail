import { JSDOM } from 'jsdom';
import { RésolveurDePage } from '../resolveurDePage.js';
import { AdaptateurDom } from './adaptateurDom.js';

export interface FournisseurDeTitre {
  titre(routeDemandée: string): Promise<string | undefined>;
}

export class TitreDeGuide implements FournisseurDeTitre {
  constructor(private readonly résolveurDePage: RésolveurDePage) {}

  async titre(route: string) {
    const guide = await this.résolveurDePage.guide(route);
    if (!guide) return undefined;
    return guide.langue === 'EN' ? `${guide.nom} (EN)` : guide.nom;
  }
}

export class TitreDeFinancement implements FournisseurDeTitre {
  constructor(private readonly résolveurDePage: RésolveurDePage) {}

  async titre(route: string) {
    const financement = await this.résolveurDePage.financement(route);
    return financement ? `${financement.nom} (${financement.perimetresGeographiques})` : undefined;
  }
}

export class TitreDArticleCrisp implements FournisseurDeTitre {
  constructor(private readonly résolveurDePage: RésolveurDePage) {}

  async titre(route: string) {
    const article = await this.résolveurDePage.articleCrisp(route);
    return article?.titre;
  }
}

export class AdaptateurTitre implements AdaptateurDom {
  constructor(private readonly fournisseurs: FournisseurDeTitre[]) {}

  async adapte(dom: JSDOM, routeDemandée: string) {
    const titres = await Promise.all(this.fournisseurs.map((f) => f.titre(routeDemandée)));
    const titre = titres.find((t) => t !== undefined);

    if (!titre) {
      return;
    }
    const nouveauTitre = `${titre} | MesServicesCyber`;

    const titreHtml = dom.window.document.getElementsByTagName('title').item(0);
    if (titreHtml) {
      titreHtml.innerHTML = nouveauTitre;
    }
    dom.window.document.querySelector('meta[property="og:title"]')?.setAttribute('content', nouveauTitre);
    dom.window.document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', nouveauTitre);
  }
}
