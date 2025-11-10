import { parse } from 'node-html-parser';

export class RecuperateurDAdressesDesGuides {
  constructor(private lecteurDeSite: { lis: (url: string) => string }) {}

  recupere(url: string): string[] {
    const contenuHtml = this.lecteurDeSite.lis(url);
    const document = parse(contenuHtml);

    const adresses = document.querySelectorAll('a');

    return adresses.map((adresse) => adresse.getAttribute('href')!);
  }
}
