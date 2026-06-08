import { EntrepotPriseEnCompte } from '../metier/entrepotPriseEnCompte';
import { Mesure } from '../metier/mesure';
import { PriseEnCompte } from '../metier/PriseEnCompte';
import { Utilisateur } from '../metier/utilisateur';

export class EntrepotPriseEnComptePostgres implements EntrepotPriseEnCompte {
  pour(_utilisateur: Utilisateur, _mesure: Mesure): Promise<PriseEnCompte | undefined> {
    throw new Error();
  }
}
