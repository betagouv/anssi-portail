import { GuideGrist } from '../../../src/infra/entrepotGuideGrist';

export class ConstructeurGuideGrist {
  private numeroDeLigne: number = 0;
  private identifiant: string | null = null;
  private titre: string | null = null;
  private image: string | null = null;
  private langue: 'FR' | 'EN' | null = null;
  private collections: string[] = [];

  avecLeNumeroDeLigne(numerodeLigne: number) {
    this.numeroDeLigne = numerodeLigne;
    return this;
  }

  avecLIdentifiant(identifiant: string) {
    this.identifiant = identifiant;
    return this;
  }

  avecLeTitre(titre: string) {
    this.titre = titre;
    return this;
  }

  avecLImage(image: string) {
    this.image = image;
    return this;
  }

  avecLaLangue(langue: 'FR' | 'EN') {
    this.langue = langue;
    return this;
  }

  avecLesCollections(collections: string[]) {
    this.collections = [...collections];
    return this;
  }

  construis() {
    return {
      id: this.numeroDeLigne,
      fields: {
        Identifiant: this.identifiant,
        Titre: this.titre,
        Image: this.image,
        Langue: this.langue,
        Collections: this.collections,
      },
    } satisfies GuideGrist;
  }
}
