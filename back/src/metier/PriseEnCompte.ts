import { Mesure } from './mesure.js';
import { Utilisateur } from './utilisateur.js';

export class PriseEnCompte {
  constructor(
    readonly utilisateur: Utilisateur,
    readonly mesure: Mesure
  ) {}
}
