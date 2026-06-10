import { EntrepotPriseEnCompte } from '../../src/metier/entrepotPriseEnCompte';
import { Mesure } from '../../src/metier/mesure';
import { PriseEnCompte } from '../../src/metier/PriseEnCompte';
import { Utilisateur } from '../../src/metier/utilisateur';
import { EntrepotMemoire } from './entrepotMemoire';

export class EntrepotPriseEnCompteMemoire extends EntrepotMemoire<PriseEnCompte> implements EntrepotPriseEnCompte {
  pour(utilisateur: Utilisateur): Promise<PriseEnCompte[]>;
  pour(utilisateur: Utilisateur, mesure: Mesure): Promise<PriseEnCompte | undefined>;
  async pour(utilisateur: Utilisateur, mesure?: Mesure) {
    if (mesure) {
      return this.entites.find((p) => p.mesure.id === mesure.id && p.utilisateur.email === utilisateur.email);
    } else {
      return this.entites.filter((p) => p.utilisateur.email === utilisateur.email);
    }
  }
}
