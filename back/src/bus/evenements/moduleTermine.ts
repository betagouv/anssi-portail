import { Parcours } from '../../metier/parcours.js';

export class ModuleTermine {
  constructor(
    readonly emailHache: string,
    readonly idModule: number,
    readonly nomModule: string,
    readonly parcours?: Parcours
  ) {}
}
