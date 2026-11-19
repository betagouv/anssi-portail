import { Utilisateur } from '../../utilisateur.js';
import { RésultatTest } from './resultatTest.js';

export interface EntrepôtRésultatTest<T extends RésultatTest> {
  taille(): Promise<number>;
  ajoute(résultatTest: T): Promise<void>;
  parId(id: string): Promise<T | undefined>;
  metsÀjour(résultatTest: T): Promise<void>;
  dernierPourUtilisateur(utilisateur: Utilisateur): Promise<T | undefined>;
  pourUtilisateur(utilisateur: Utilisateur): Promise<T[]>;
}
