import { parse } from 'node-html-parser';
import { LecteurSite } from './lecteurDeSiteHttp';

type Guide = {
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
      titre: document.querySelector('h1')!.innerText,
      resume: document.querySelector('.banniere-group p')!.innerText,
      datePublication: document
        .querySelector('.published-on')!
        .innerText.trim()
        .substring(10),
      dateMiseAJour: document
        .querySelector('.updated-on')!
        .innerText.trim()
        .substring(14),
    };
  }
}
