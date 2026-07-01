import { EntrepotPriseEnCompte } from '../../src/metier/entrepotPriseEnCompte.js';
import { Mesure } from '../../src/metier/mesure.js';
import { PriseEnCompte } from '../../src/metier/PriseEnCompte.js';
import { Utilisateur } from '../../src/metier/utilisateur.js';
import { EntrepotMemoire } from './entrepotMemoire.js';

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
