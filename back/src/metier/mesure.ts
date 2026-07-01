import { ExigenceNIS2 } from './nis2/exigence.js';

export class IdMesure {
  constructor(private readonly id: string) {}

  estValide(): boolean {
    return /[A-Z_]{1,20}\.[0-9]{1,2}/.test(this.id);
  }
}

export type Risque = {
  libelle: string;
  description: string;
};

export type LienPourAllerPlusLoin = {
  libelle: string;
  url: string;
};

export class Mesure {
  constructor(
    readonly id: string,
    readonly titre: string,
    readonly phraseAccroche: string,
    readonly explications: string,
    readonly actionPrioritaire: string,
    readonly actionFacileAFaire: string,
    readonly ordre: number,
    readonly risques: Risque[],
    readonly liens: LienPourAllerPlusLoin[],
    readonly exigences: ExigenceNIS2[]
  ) {}
}
