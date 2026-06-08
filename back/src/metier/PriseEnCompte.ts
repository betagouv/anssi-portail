import { Mesure } from './mesure';
import { Utilisateur } from './utilisateur';

export class PriseEnCompte {
  constructor(
    readonly utilisateur: Utilisateur,
    readonly mesure: Mesure
  ) {}
}
