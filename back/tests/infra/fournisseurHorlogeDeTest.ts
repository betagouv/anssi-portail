import { FournisseurHorloge } from '../../src/infra/fournisseurHorloge.js';

export class FournisseurHorlogeDeTest {
  static initialise(maintenant: Date) {
    FournisseurHorloge.maintenant = () => maintenant;
  }
}
