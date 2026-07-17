import { JSDOM } from 'jsdom';
import { AdaptateurDom } from './adaptateurDom.js';

export class AdaptateurLiensSeo implements AdaptateurDom {
  adapte(dom: JSDOM) {
    const liens = dom.window.document.getElementsByTagName('msc-lien');
    for (const lien of liens) {
      const url = lien.getAttribute('href');
      const libelle = lien.getAttribute('libelle');
      lien.insertAdjacentHTML('afterbegin', `<a slot="seo" href="${url}">${libelle}</a>`);
    }
  }
}
