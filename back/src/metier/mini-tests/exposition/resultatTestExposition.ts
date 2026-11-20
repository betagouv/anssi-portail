import { Utilisateur } from '../../utilisateur.js';
import { DonnéesCréationRésultatTest, RésultatTest } from '../resultat-test/resultatTest.js';

export type DonnéesCréationRésultatTestExposition = {
  utilisateur: Utilisateur;
} & DonnéesCréationRésultatTest;

export class RésultatTestExposition extends RésultatTest {
  declare public utilisateur: Utilisateur;

  constructor({ id, dateRealisation, utilisateur }: DonnéesCréationRésultatTestExposition) {
    super({ id, dateRealisation, utilisateur });
  }
}
