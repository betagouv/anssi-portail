import { JSDOM } from 'jsdom';
import { render } from 'svelte/server';
import { FournisseurChemin } from '../../api/fournisseurChemin.js';
import { EntrepotGuide } from '../../metier/entrepotGuide.js';
import { EntrepotExigence } from '../../metier/nis2/entrepotExigence.js';
import { guidePresentation } from '../../presentation/guides/guidePresentation.js';
import { AdaptateurEnvironnement } from '../adaptateurEnvironnement.js';
import { composantsAutorisés } from './composantsAutorises.genere.js';

export interface AdaptateurEnrichissement {
  enrichisAvecComposants: (contenuPage: string, routeDemandée: string) => Promise<string>;
}

class AdaptateurEnrichissementSvelte implements AdaptateurEnrichissement {
  constructor(
    private readonly composantsAutorisés: string[],
    private readonly fournisseurDeChemin: FournisseurChemin,
    private readonly entrepotGuide: EntrepotGuide,
    private readonly adaptateurEnvironnement: AdaptateurEnvironnement,
    private readonly entrepôtExigence: EntrepotExigence
  ) {}
  async enrichisAvecComposants(contenuPage: string, routeDemandée: string) {
    try {
      const dom = new JSDOM(contenuPage);
      const divDInjectionCSS = dom.window.document.getElementsByTagName('head');
      for (const nomComposant of this.composantsAutorisés) {
        let props = await this.chargeRessourcesCyber(dom);
        props = await this.chargeGuide(props, routeDemandée);
        props = await this.chargeExigences(dom, props);
        const divDInjection = dom.window.document.getElementById(nomComposant);
        if (!divDInjection) {
          continue;
        }
        const cheminDuComposant = this.fournisseurDeChemin.ressourceDeBase(
          `lib-svelte/dist/serveur/assets/${nomComposant}.js`
        );
        const composantSvelte = await import(cheminDuComposant);
        const { head, body } = render(composantSvelte.default, { props });
        if (divDInjectionCSS.length) {
          divDInjectionCSS[0].insertAdjacentHTML('beforeend', head.replaceAll('<style ', '<style nonce="%%NONCE%%" '));
        }

        divDInjection.innerHTML = body;
      }

      this.afficheLesLiens(dom);
      this.adapteLienCanonique(dom, routeDemandée);
      await this.adapteTitre(dom, routeDemandée);

      return dom.serialize();
    } catch (e) {
      console.error("Erreur lors de l'injection svelte : ", e);
    }
    return contenuPage;
  }

  private afficheLesLiens(dom: JSDOM) {
    const liens = dom.window.document.getElementsByTagName('msc-lien');
    for (const lien of liens) {
      const url = lien.getAttribute('href');
      const libelle = lien.getAttribute('libelle');
      lien.insertAdjacentHTML('afterbegin', `<a slot="seo" href="${url}">${libelle}</a>`);
    }
  }

  private adapteLienCanonique(dom: JSDOM, routeDemandée: string): void {
    const lienCanonique = dom.window.document.querySelector('link[rel="canonical"]');
    if (!lienCanonique) return;

    const href = lienCanonique.getAttribute('href') ?? '';
    const nouveauHref = href.replace(/\/(financements|guides)$/, routeDemandée);
    lienCanonique.setAttribute('href', nouveauHref);
  }

  private async adapteTitre(dom: JSDOM, routeDemandée: string) {
    const idGuide = routeDemandée.match(/\/guides\/(.*)/)?.[1];
    const guideTrouvé = (await this.entrepotGuide.tous()).find((g) => g.id === idGuide);
    const titre = dom.window.document.getElementsByTagName('title').item(0);
    if (titre && guideTrouvé) {
      titre.innerHTML = `${guideTrouvé.nom} | MesServicesCyber`;
    }
  }

  private async chargeRessourcesCyber(dom: JSDOM) {
    const donnees = dom.window.document.getElementById('donnees-items-cyber')?.textContent;

    if (donnees) {
      const { itemsCyber, repartition } = JSON.parse(donnees);
      const guides = await this.entrepotGuide.tous();
      const guidesAvecImages = guides.map(guidePresentation(this.adaptateurEnvironnement));
      return { itemsCyber, guides: guidesAvecImages, repartition };
    }

    return {};
  }

  private async chargeGuide(props: Record<string, unknown>, routeDemandée: string) {
    const idGuide = routeDemandée.match(/\/guides\/(.*)/)?.[1];
    if (!idGuide) {
      return props;
    }
    const guideTrouvé = (await this.entrepotGuide.tous()).find((g) => g.id === idGuide);
    if (!guideTrouvé) {
      return props;
    }
    const guideInitial = guidePresentation(this.adaptateurEnvironnement)(guideTrouvé);
    return { ...props, guideInitial };
  }

  private async chargeExigences(dom: JSDOM, props: Record<string, unknown>) {
    const pageNis2 = dom.window.document.getElementById('page-directive-nis2');
    if (pageNis2) {
      const exigences = await this.entrepôtExigence.parReferentiel('NIS2');
      return { ...props, exigences };
    }
    return props;
  }
}

export const fabriqueAdaptateurEnrichissement = async (
  adaptateurEnvironnement: AdaptateurEnvironnement,
  fournisseurDeChemin: FournisseurChemin,
  entrepotGuide: EntrepotGuide,
  entrepôtExigence: EntrepotExigence
): Promise<AdaptateurEnrichissement> => {
  return new AdaptateurEnrichissementSvelte(
    composantsAutorisés,
    fournisseurDeChemin,
    entrepotGuide,
    adaptateurEnvironnement,
    entrepôtExigence
  );
};
