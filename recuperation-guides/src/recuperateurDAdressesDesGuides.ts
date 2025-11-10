import { parse } from 'node-html-parser';

export class RecuperateurDAdressesDesGuides {
  constructor(
    private lecteurDeSite: { lis: (url: string) => Promise<string> }
  ) {}

  async recupere(url: string, nombreDePages: number): Promise<string[]> {
    const strings = [];
    for (let page = 0; page < nombreDePages; page++) {
      const vraieUrl = new URL(url);
      vraieUrl.searchParams.set('page', page.toString());
      const contenuHtml = await this.lecteurDeSite.lis(vraieUrl.toString());
      const document = parse(contenuHtml);

      const adresses = document.querySelectorAll('.views-row a');

      strings.push(
        ...adresses.map((adresse) =>
          new URL(adresse.getAttribute('href')!, url).toString()
        )
      );
    }
    return strings;
  }
}
