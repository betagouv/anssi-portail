import { Mesure } from './mesure.js';

export class Module {
  mesures: Mesure[] = [];

  constructor(
    readonly id: number,
    readonly nom: string
  ) {}

  cibleDéblocageBadgeCyberdépart = () => (this.id === 1 ? Math.floor(this.mesures.length * 0.8) : undefined);

  rangDeLaMesure = (mesure: Mesure) =>
    this.mesures.toSorted((a, b) => a.ordre - b.ordre).findIndex((m) => m.id === mesure.id);

  positionDeLaMesure = (mesure: Mesure) => this.rangDeLaMesure(mesure) + 1;

  nombreDeMesures = () => this.mesures.length;
}
