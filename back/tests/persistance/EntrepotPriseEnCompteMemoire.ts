import { EntrepotPriseEnCompte } from '../../src/metier/entrepotPriseEnCompte';
import { Mesure } from '../../src/metier/mesure';
import { PriseEnCompte } from '../../src/metier/PriseEnCompte';
import { Utilisateur } from '../../src/metier/utilisateur';
import { EntrepotMemoire } from './entrepotMemoire';

export class EntrepotPriseEnCompteMemoire extends EntrepotMemoire<PriseEnCompte> implements EntrepotPriseEnCompte {
  async pour(utilisateur: Utilisateur, mesure: Mesure): Promise<PriseEnCompte | undefined> {
    return this.entites.find((p) => p.mesure.id === mesure.id && p.utilisateur.email === utilisateur.email);
  }
}
