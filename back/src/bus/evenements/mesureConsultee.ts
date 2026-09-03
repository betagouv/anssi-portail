import { Parcours } from '../../metier/parcours.js';

export class MesureConsultee {
  constructor(
    readonly email: string,
    readonly idMesure: string,
    readonly parcours?: Parcours
  ) {}
}
