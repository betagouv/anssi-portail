import { HTMLElement, parse } from 'node-html-parser';
import { LecteurSite } from './lecteurDeSiteHttp';

export type Guide = {
  id: string;
  dateMiseAJour: string;
  datePublication: string;
  resume: string;
  titre: string;
  description: string;
  image: string;
  documents: string;
  contenusLies: string;
};

export class RecuperateurGuide {
  constructor(private lecteurSite: LecteurSite) {}

  async recupere(urlGuide: string): Promise<Guide> {
    const contenuHtml = await this.lecteurSite.lis(urlGuide);
    const document = parse(contenuHtml);
    const partiesURL = urlGuide.split('/');
    return {
      id: partiesURL.at(-1)!,
      titre: this.recupereTexte(document, 'h1'),
      resume: this.recupereTexte(document, '.banniere-group p'),
      datePublication: this.recupereTexte(document, '.published-on', 10),
      dateMiseAJour: this.recupereTexte(document, '.updated-on', 14),
      description: this.recupereHtml(document, '.text-riche > div'),
      image: this.recupereLien(document, '.img-princiale img', 'src', {
        urlDeBase: urlGuide,
      }),
      documents: this.recupereDocuments(document, { urlDeBase: urlGuide }),
      contenusLies: this.recuperecontenusLies(
        document,
        '.field--name-field-contenu-lie > div',
        { urlDeBase: urlGuide }
      ),
    };
  }

  private recupereTexte(
    document: HTMLElement,
    selecteur: string,
    debut: number = 0
  ) {
    return document.querySelector(selecteur)!.innerText.trim().substring(debut);
  }

  private recupereHtml(document: HTMLElement, selecteur: string) {
    return document
      .querySelector(selecteur)!
      .innerHTML.trim()
      .replaceAll(/\s+/g, ' ')
      .replaceAll('> <', '><');
  }

  private recupereLien(
    document: HTMLElement,
    selecteur: string,
    attribut: string,
    { urlDeBase }: { urlDeBase?: string }
  ) {
    const lien = document.querySelector(selecteur)!.getAttribute(attribut)!;
    return new URL(lien, urlDeBase).toString();
  }

  private recupereDocuments(
    document: HTMLElement,
    { urlDeBase }: { urlDeBase?: string }
  ) {
    const elements = [
      ...document.querySelectorAll('.paragraph--type--piece-jointe'),
      ...document.querySelectorAll('.field--name-field-fichier-pdf'),
    ];
    return elements
      .map((element) => {
        const lien = this.recupereLien(element, '.document > a', 'href', {
          urlDeBase,
        });
        const nom = this.recupereTexte(element, '.document > a > .name');
        return `${nom} : ${lien}`;
      })
      .join('\n');
  }

  private recuperecontenusLies(
    document: HTMLElement,
    selecteur: string,
    { urlDeBase }: { urlDeBase?: string }
  ) {
    const elements = document.querySelectorAll(selecteur);
    return elements
      .map((element) => {
        return this.recupereLien(element, 'a', 'href', { urlDeBase });
      })
      .join('\n');
  }
}
