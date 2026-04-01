import { EntrepotGuideTravail } from '../../src/metier/entrepotGuideTravail';
import { Guide } from '../../src/metier/guide';
import { EntrepotMemoire } from './entrepotMemoire';

export class EntrepotGuideTravailMemoire extends EntrepotMemoire<Guide> implements EntrepotGuideTravail {
  async parId(id: string): Promise<Guide | undefined> {
    return this.entites.find((guide) => guide.id === id);
  }

  async ajouteDocument(_idGuide: string, _nomDocument: string, _libelleDuLien: string): Promise<void> {
    return;
  }
}
