import { Mesure } from './mesure';
import { PriseEnCompte } from './PriseEnCompte';
import { Utilisateur } from './utilisateur';

export interface EntrepotPriseEnCompte {
  pour(utilisateur: Utilisateur, mesure: Mesure): Promise<PriseEnCompte | undefined>;
}
