import { EntrepotGuide } from '../../src/metier/entrepotGuide';
import { Guide } from '../../src/metier/guide';
import { EntrepotMemoire } from './entrepotMemoire';

export class EntrepotGuideMemoire
  extends EntrepotMemoire<Guide>
  implements EntrepotGuide
{
  async parId(id: string): Promise<Guide | undefined> {
    return this.entites.find((guide) => guide.id === id);
  }
  async vide() {
    this.entites = [];
  }
  async parCollections(collections: string[]): Promise<Guide[]> {
    return this.entites.filter((guide) =>
      guide.collections.some((uneCollectionDuGuide) =>
        collections.includes(uneCollectionDuGuide)
      )
    );
  }
}
