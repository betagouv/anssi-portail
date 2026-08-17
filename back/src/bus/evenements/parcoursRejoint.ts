import { MotifChangementParcours, Parcours } from '../../metier/parcours.js';
import { Suivi } from '../../metier/suivi.js';

export class ParcoursRejoint {
  constructor(
    readonly emailHache: string,
    readonly parcours: Parcours,
    readonly motif: MotifChangementParcours,
    readonly suivi?: Suivi
  ) {}
}
