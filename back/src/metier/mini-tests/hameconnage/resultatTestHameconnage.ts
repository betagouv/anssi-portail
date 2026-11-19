import { Utilisateur } from '../../utilisateur.js';
import { DonnéesCréationRésultatTest, RésultatTest } from '../resultat-test/resultatTest.js';

export type DonnéesCréationRésultatTestHameçonnage = {
  utilisateur: Utilisateur;
  score: string;
} & DonnéesCréationRésultatTest;

export class RésultatTestHameçonnage extends RésultatTest {
  declare public utilisateur: Utilisateur;
  public readonly score: string;

  constructor({ id, dateRealisation, utilisateur, score }: DonnéesCréationRésultatTestHameçonnage) {
    super({ id, dateRealisation, utilisateur });

    this.score = score;
  }
}
