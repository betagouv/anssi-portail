import { Parcours } from '../../metier/parcours.js';

export class ParcoursChangé {
  constructor(
    readonly emailHache: string,
    readonly parcoursPrécédent: Parcours,
    readonly parcours: Parcours
  ) {}
}
