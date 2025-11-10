import { HTMLElement, parse } from 'node-html-parser';
import { LecteurSite } from './lecteurDeSiteHttp';

export type Guide = {
  dateMiseAJour: string;
  datePublication: string;
  resume: string;
  titre: string;
  description: string;
  image: string;
};

export class RecuperateurGuide {
  constructor(private lecteurSite: LecteurSite) {}

  async recupere(urlGuide: string): Promise<Guide> {
    const contenuHtml = await this.lecteurSite.lis(urlGuide);
    const document = parse(contenuHtml);
    return {
      titre: this.recupereTexte(document, 'h1'),
      resume: this.recupereTexte(document, '.banniere-group p'),
      datePublication: this.recupereTexte(document, '.published-on', 10),
      dateMiseAJour: this.recupereTexte(document, '.updated-on', 14),
      description: this.recupereHtml(document, '.text-riche > div'),
      image: this.recupereLien(document, '.img-princiale img', 'src', {
        urlDeBase: urlGuide,
      }),
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
}
