import { Mesure } from './mesure';
import { PriseEnCompte } from './PriseEnCompte';
import { Utilisateur } from './utilisateur';

export interface EntrepotPriseEnCompte {
  ajoute(priseEnCompte: PriseEnCompte): Promise<void>;
  pour(utilisateur: Utilisateur, mesure: Mesure): Promise<PriseEnCompte | undefined>;
}
