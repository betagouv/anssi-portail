import { JSDOM } from 'jsdom';
import { render } from 'svelte/server';
//@ts-expect-error fichier compilé
import entreprises from '../../../front/lib-svelte/dist/serveur/assets/entreprises.js';

export async function enrichisAvecComposantsSvelte(chemin: string, avecNonceEtVersion: string) {
  if (chemin.endsWith('entreprises/index.html')) {
    const { head, body } = render(entreprises);
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
  } else {
    return avecNonceEtVersion;
  }
}
