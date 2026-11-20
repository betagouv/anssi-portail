import { Utilisateur } from '../../utilisateur.js';
import { DonnéesCréationRésultatTest, RésultatTest } from '../resultat-test/resultatTest.js';

export type DonnéesCréationRésultatTestRéflexesCyber = {
  utilisateur: Utilisateur;
  score: string;
} & DonnéesCréationRésultatTest;

export class RésultatTestRéflexesCyber extends RésultatTest {
  declare public utilisateur: Utilisateur;
  public readonly score: string;

  constructor({ id, dateRealisation, utilisateur, score }: DonnéesCréationRésultatTestRéflexesCyber) {
    super({ id, dateRealisation, utilisateur });

    this.score = score;
  }
}
