import { JSDOM } from 'jsdom';
import { render } from 'svelte/server';

export interface AdaptateurEnrichissement {
  enrichisAvecComposants: (chemin: string, avecNonceEtVersion: string) => Promise<string>;
}

export class AdaptateurEnrichissementSvelte implements AdaptateurEnrichissement {
  async enrichisAvecComposants(chemin: string, avecNonceEtVersion: string) {
    console.log('VRAIE IMPLEM');
    try {
      //@ts-expect-error fichier compilé
      const entreprises = await import('../../../front/lib-svelte/dist/serveur/assets/entreprises.js');
      if (chemin.endsWith('entreprises/index.html')) {
        const { head, body } = render(entreprises.default);
        const dom = new JSDOM(avecNonceEtVersion);
        const divDInjectionCSS = dom.window.document.getElementsByTagName('head');
        if (divDInjectionCSS.length) {
          divDInjectionCSS[0].insertAdjacentHTML('beforeend', head);
        }
        const divDInjection = dom.window.document.getElementById('entreprises');

        if (divDInjection) {
          divDInjection.innerHTML = body;
        }

        return dom.serialize();
      }
    } catch {
      /* empty */
    }
    return avecNonceEtVersion;
  }
}
