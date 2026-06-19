import { Mesure } from './mesure';

export class Module {
  mesures: Mesure[] = [];

  constructor(
    readonly id: number,
    readonly nom: string
  ) {}

  cibleDéblocageBadgeCyberdépart() {
    return Math.floor(this.mesures.length * 0.8);
  }
}
