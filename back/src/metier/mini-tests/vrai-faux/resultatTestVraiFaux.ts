import { Utilisateur } from '../../utilisateur.js';
import { DonnéesCréationRésultatTest, RésultatTest } from '../resultat-test/resultatTest.js';

export type DonnéesCréationRésultatTestVraiFaux = {
  utilisateur: Utilisateur;
  score: string;
} & DonnéesCréationRésultatTest;

export class RésultatTestVraiFaux extends RésultatTest {
  declare public readonly utilisateur: Utilisateur;
  public readonly score: string;

  constructor({ id, dateRealisation, utilisateur, score }: DonnéesCréationRésultatTestVraiFaux) {
    super({ id, dateRealisation, utilisateur });

    this.score = score;
  }
}
