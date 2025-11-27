import { FournisseurHorloge } from '../../src/infra/fournisseurHorloge';

export class FournisseurHorlogeDeTest {
  static initialise(maintenant: Date) {
    FournisseurHorloge.maintenant = () => maintenant;
  }
}
