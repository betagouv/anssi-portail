import { EntrepotGuide } from '../../src/metier/entrepotGuide';
import { Guide } from '../../src/metier/guide';
import { EntrepotMemoire } from './entrepotMemoire';

export class EntrepotGuideMemoire
  extends EntrepotMemoire<Guide>
  implements EntrepotGuide
{
  async vide() {
    this.entites = [];
  }
}
