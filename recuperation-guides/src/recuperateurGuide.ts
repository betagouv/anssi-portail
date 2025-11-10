import { parse } from 'node-html-parser';

export class RecuperateurGuide {
  constructor(private lecteurSite: { lis: (url: string) => Promise<string> }) {}
  async recupere(urlGuide: string): Promise<{
    dateMiseAJour: string;
    datePublication: string;
    resume: string;
    titre: string;
  }> {
    const contenuHtml = await this.lecteurSite.lis(urlGuide);
    const document = parse(contenuHtml);
    return {
      titre: document.querySelector('h1')!.innerText,
      resume: document.querySelector('.banniere-group p')!.innerText,
      datePublication: document
        .querySelector('.published-on')!
        .innerText.trim()
        .substring(10),
      dateMiseAJour:document
        .querySelector('.updated-on')!
        .innerText.trim()
        .substring(14),
    };
  }
}
