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
  urlDocuments: string[];
  documents: string;
  contenusLies: string;
  langue: 'FR' | 'EN';
  nomImage: string;
};

export class RecuperateurGuide {
  constructor(private lecteurSite: LecteurSite) {}

  async recupere(urlGuide: string): Promise<Guide> {
    const contenuHtml = await this.lecteurSite.lis(urlGuide);
    const document = parse(contenuHtml);
    const partiesURL = urlGuide.split('/');
    const langue = urlGuide.includes('/en/') ? 'EN' : 'FR';
    const image = this.recupereLien(document, '.img-princiale img', 'src', {
      urlDeBase: urlGuide,
    });
    const nomImageAvecExtension = image.split('/').at(-1);
    const nomImage = decodeURI(
      nomImageAvecExtension?.slice(0, nomImageAvecExtension.lastIndexOf('.')) ??
        ''
    );
    const [urlDocuments, documents] = this.recupereDocuments(document, {
      urlDeBase: urlGuide,
    });
    return {
      id: (langue === 'EN' ? 'en-' : '') + partiesURL.at(-1)!,
      titre: this.recupereTexte(document, 'h1'),
      resume: this.recupereTexte(document, '.banniere-group p'),
      datePublication: this.recupereDate(document, '.published-on'),
      dateMiseAJour: this.recupereDate(document, '.updated-on'),
      description: this.recupereHtml(document, '.text-riche > div'),
      image: image,
      nomImage,
      urlDocuments,
      documents,
      contenusLies: this.recuperecontenusLies(
        document,
        '.field--name-field-contenu-lie > div',
        { urlDeBase: urlGuide }
      ),
      langue,
    };
  }

  private recupereTexte(
    document: HTMLElement,
    selecteur: string,
    debut: number = 0
  ) {
    return document.querySelector(selecteur)!.innerText.trim().substring(debut);
  }

  private recupereDate(document: HTMLElement, selecteur: string) {
    const texteBrut = document.querySelector(selecteur)!.innerText.trim();
    return texteBrut.substring(texteBrut.search(/\d/));
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
    if (!lien) {
      return '';
    }
    return new URL(lien, urlDeBase).toString();
  }

  private recupereDocuments(
    document: HTMLElement,
    { urlDeBase }: { urlDeBase?: string }
  ): [string[], string] {
    const elements = [
      ...document.querySelectorAll('.paragraph--type--piece-jointe'),
      ...document.querySelectorAll('.field--name-field-fichier-pdf'),
    ];
    const urlDocuments = elements.map((element) =>
      this.recupereLien(element, '.document > a', 'href', {
        urlDeBase,
      })
    );
    const documents = elements
      .map((element) => {
        const lien = this.recupereLien(element, '.document > a', 'href', {
          urlDeBase,
        });
        const nom = this.recupereTexte(element, '.document > a > .name');
        const nomDocument = decodeURI(lien.split('/').at(-1) ?? '');
        return `${nom} : ${nomDocument}`;
      })
      .join('\n');
    return [urlDocuments, documents];
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
