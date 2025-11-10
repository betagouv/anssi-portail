import { HTMLElement, parse } from 'node-html-parser';
import { LecteurSite } from './lecteurDeSiteHttp';

export type Guide = {
  dateMiseAJour: string;
  datePublication: string;
  resume: string;
  titre: string;
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
    };
  }

  private recupereTexte(
    document: HTMLElement,
    selecteur: string,
    debut: number = 0
  ) {
    return document.querySelector(selecteur)!.innerText.trim().substring(debut);
  }
}
