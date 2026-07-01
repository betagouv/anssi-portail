import { Mesure } from './mesure.js';
import { PriseEnCompte } from './PriseEnCompte.js';
import { Utilisateur } from './utilisateur.js';

export interface EntrepotPriseEnCompte {
  ajoute(priseEnCompte: PriseEnCompte): Promise<void>;
  pour(utilisateur: Utilisateur): Promise<PriseEnCompte[]>;
  pour(utilisateur: Utilisateur, mesure: Mesure): Promise<PriseEnCompte | undefined>;
}
