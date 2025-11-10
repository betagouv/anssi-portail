import { parse } from 'node-html-parser';
import { LecteurSite } from './lecteurDeSiteHttp';

export class RecuperateurDAdressesDesGuides {
  constructor(private lecteurDeSite: LecteurSite) {}

  async recupere(url: string, nombreDePages: number): Promise<string[]> {
    const resultat = [];
    for (let page = 0; page < nombreDePages; page++) {
      const vraieUrl = new URL(url);
      vraieUrl.searchParams.set('page', page.toString());
      const contenuHtml = await this.lecteurDeSite.lis(vraieUrl.toString());
      const document = parse(contenuHtml);

      const adresses = document.querySelectorAll('.views-row a');

      resultat.push(
        ...adresses.map((adresse) =>
          new URL(adresse.getAttribute('href')!, url).toString()
        )
      );
    }
    return resultat;
  }
}
