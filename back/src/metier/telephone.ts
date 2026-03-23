export class Telephone {
  constructor(private readonly telephone?: string) {}

  auFormatInternational(): string {
    return this.telephone ? `+33${this.telephone.substring(1)}` : '';
  }
}
