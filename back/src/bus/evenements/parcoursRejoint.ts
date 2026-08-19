import { MotifChangementParcours, Parcours } from '../../metier/parcours.js';
import { Suivi } from '../../metier/suivi.js';

export class ParcoursRejoint {
  constructor(
    readonly email: string,
    readonly parcours: Parcours,
    readonly motif: MotifChangementParcours,
    readonly suivi?: Suivi
  ) {}
}
