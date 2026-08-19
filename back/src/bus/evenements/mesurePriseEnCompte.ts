import { Parcours } from '../../metier/parcours.js';

export class MesurePriseEnCompte {
  constructor(
    readonly email: string,
    readonly idMesure: string,
    readonly nombreDeMesures: number,
    readonly position: number,
    readonly parcours?: Parcours
  ) {}
}
