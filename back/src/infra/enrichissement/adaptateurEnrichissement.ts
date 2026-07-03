import { JSDOM } from 'jsdom';
import { render } from 'svelte/server';
import { composantsAutorisés } from './composantsAutorises.genere.js';
import { FournisseurChemin } from '../../api/fournisseurChemin.js';

export interface AdaptateurEnrichissement {
  enrichisAvecComposants: (contenuPage: string) => Promise<string>;
}

class AdaptateurEnrichissementSvelte implements AdaptateurEnrichissement {
  constructor(
    private composantsAutorisés: string[],
    private fournisseurDeChemin: FournisseurChemin
  ) {}
  async enrichisAvecComposants(contenuPage: string) {
    try {
      const dom = new JSDOM(contenuPage);
      const divDInjectionCSS = dom.window.document.getElementsByTagName('head');
      for (const nomComposant of this.composantsAutorisés) {
        const divDInjection = dom.window.document.getElementById(nomComposant);
        if (!divDInjection) {
          continue;
        }
        const cheminDuComposant = this.fournisseurDeChemin.ressourceDeBase(
          `lib-svelte/dist/serveur/assets/${nomComposant}.js`
        );
        const composantSvelte = await import(cheminDuComposant);
        const { head, body } = render(composantSvelte.default);
        if (divDInjectionCSS.length) {
          divDInjectionCSS[0].insertAdjacentHTML('beforeend', head);
        }

        divDInjection.innerHTML = body;
      }

      return dom.serialize();
    } catch (e) {
      console.error("Erreur lors de l'injection svelte : ", e);
    }
    return contenuPage;
  }
}

export const fabriqueAdaptateurEnrichissement = async (
  fournisseurDeChemin: FournisseurChemin
): Promise<AdaptateurEnrichissement> => {
  return new AdaptateurEnrichissementSvelte(composantsAutorisés, fournisseurDeChemin);
};
