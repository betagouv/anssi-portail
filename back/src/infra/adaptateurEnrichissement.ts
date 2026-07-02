import { JSDOM } from 'jsdom';
import { render } from 'svelte/server';

export interface AdaptateurEnrichissement {
  enrichisAvecComposants: (contenuPage: string) => Promise<string>;
}

const composantsSsr = ['entreprises', 'associations'];

export class AdaptateurEnrichissementSvelte implements AdaptateurEnrichissement {
  async enrichisAvecComposants(contenuPage: string) {
    try {
      const dom = new JSDOM(contenuPage);
      const divDInjectionCSS = dom.window.document.getElementsByTagName('head');
      for (const nomComposant of composantsSsr) {
        const divDInjection = dom.window.document.getElementById(nomComposant);
        if (!divDInjection) {
          continue;
        }
        const composantSvelte = await import(`../../../front/_site/lib-svelte/dist/serveur/assets/${nomComposant}.js`);
        const { head, body } = render(composantSvelte.default);
        if (divDInjectionCSS.length) {
          divDInjectionCSS[0].insertAdjacentHTML('beforeend', head);
        }

        divDInjection.innerHTML = body;
      }

      return dom.serialize();
    } catch {
      /* vide */
    }
    return contenuPage;
  }
}
