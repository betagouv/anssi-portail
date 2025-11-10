import { parse } from 'node-html-parser';

export class RecuperateurDAdressesDesGuides {
  constructor(
    private lecteurDeSite: { lis: (url: string) => Promise<string> }
  ) {}

  async recupere(url: string): Promise<string[]> {
    const contenuHtml = await this.lecteurDeSite.lis(url);
    const document = parse(contenuHtml);

    const adresses = document.querySelectorAll('.views-row a');

    return adresses.map((adresse) =>
      new URL(adresse.getAttribute('href'), url).toString()
    );
  }
}
