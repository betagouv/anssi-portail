import { EntrepotPriseEnCompte } from '@metier/entrepotPriseEnCompte.js';
import { Mesure } from '@metier/mesure.js';
import { PriseEnCompte } from '@metier/priseEnCompte.js';
import { Utilisateur } from '@metier/utilisateur.js';

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
