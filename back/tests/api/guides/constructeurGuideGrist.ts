import { GuideGrist } from '../../../src/infra/entrepotGuideGrist';

export class ConstructeurGuideGrist {
  private numeroDeLigne: number = 0;
  private identifiant: string | null = null;
  private titre: string | null = null;
  private image: string | null = null;

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

  construis() {
    return {
      id: this.numeroDeLigne,
      fields: {
        Identifiant: this.identifiant,
        Titre: this.titre,
        Image: this.image,
      },
    } satisfies GuideGrist;
  }
}
