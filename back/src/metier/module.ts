import { Mesure } from './mesure';

export class Module {
  mesures: Mesure[] = [];

  constructor(
    readonly id: number,
    readonly nom: string
  ) {}

  cibleDéblocageBadgeCyberdépart = () => Math.floor(this.mesures.length * 0.8);

  nombreDeMesures = () => this.mesures.length;
}
