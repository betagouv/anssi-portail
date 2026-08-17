import { MotifChangementParcours, Parcours } from '../../metier/parcours.js';
import { Suivi } from '../../metier/suivi.js';

export class ParcoursChangé {
  constructor(
    readonly emailHache: string,
    readonly parcoursPrécédent: Parcours,
    readonly parcours: Parcours,
    readonly motif: MotifChangementParcours,
    readonly suivi?: Suivi
  ) {}
}
