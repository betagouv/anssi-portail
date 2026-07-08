import { JSDOM } from 'jsdom';
import { render } from 'svelte/server';
import { composantsAutorisés } from './composantsAutorises.genere.js';
import { FournisseurChemin } from '../../api/fournisseurChemin.js';
import { EntrepotGuide } from '../../metier/entrepotGuide.js';

export interface AdaptateurEnrichissement {
  enrichisAvecComposants: (contenuPage: string) => Promise<string>;
}

class AdaptateurEnrichissementSvelte implements AdaptateurEnrichissement {
  constructor(
    private readonly composantsAutorisés: string[],
    private readonly fournisseurDeChemin: FournisseurChemin,
    private readonly entrepotGuide: EntrepotGuide
  ) {}
  async enrichisAvecComposants(contenuPage: string) {
    try {
      const dom = new JSDOM(contenuPage);
      const divDInjectionCSS = dom.window.document.getElementsByTagName('head');
      for (const nomComposant of this.composantsAutorisés) {
        const props = await this.récupèreItemsCyber(dom);
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

      return dom.serialize();
    } catch (e) {
      console.error("Erreur lors de l'injection svelte : ", e);
    }
    return contenuPage;
  }

  private async récupèreItemsCyber(dom: JSDOM) {
    const donnees = dom.window.document.getElementById('donnees-items-cyber')?.textContent;

    if (donnees) {
      const { itemsCyber } = JSON.parse(donnees);
      const guides = await this.entrepotGuide.tous();
      return { itemsCyber, guides };
    }

    return {};
  }
}

export const fabriqueAdaptateurEnrichissement = async (
  fournisseurDeChemin: FournisseurChemin,
  entrepotGuide: EntrepotGuide
): Promise<AdaptateurEnrichissement> => {
  return new AdaptateurEnrichissementSvelte(composantsAutorisés, fournisseurDeChemin, entrepotGuide);
};
