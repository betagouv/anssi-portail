import { Parcours } from '../../metier/parcours.js';

export class ParcoursRejoint {
  constructor(
    readonly emailHache: string,
    readonly parcours: Parcours
  ) {}
}
