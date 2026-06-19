import { Module } from './module';
import { ExigenceNIS2 } from './nis2/exigence';

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
    readonly exigences: ExigenceNIS2[],
    readonly module: Module | null = null
  ) {}

  rangDansSonModule = () => {
    if (this.module === null) {
      return -1;
    }
    return this.module.mesures.sort((a, b) => a.ordre - b.ordre).findIndex((m) => m.id === this.id);
  };

  positionDansSonModule = () => this.rangDansSonModule() + 1;
}
