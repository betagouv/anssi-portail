import { GuideGrist } from '../../../src/infra/entrepotGuideGrist';

export class ConstructeurGuideGrist {
  private numeroDeLigne: number = 0;
  private identifiant: string | null = null;

  avecLeNumeroDeLigne(numerodeLigne: number) {
    this.numeroDeLigne = numerodeLigne;
    return this;
  }

  avecLIdentifiant(identifiant: string) {
    this.identifiant = identifiant;
    return this;
  }

  construis() {
    return {
      id: this.numeroDeLigne,
      fields: {
        Identifiant: this.identifiant,
      },
    } satisfies GuideGrist;
  }
}
