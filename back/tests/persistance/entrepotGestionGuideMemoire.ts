import { EntrepotGestionGuide } from '../../src/metier/entrepotGestionGuide';
import { Guide } from '../../src/metier/guide';
import { EntrepotMemoire } from './entrepotMemoire';

export class EntrepotGestionGuideMemoire extends EntrepotMemoire<Guide> implements EntrepotGestionGuide {
  async parId(id: string): Promise<Guide | undefined> {
    return this.entites.find((guide) => guide.id === id);
  }

  async ajouteDocument(_idGuide: string, _nomDocument: string, _libelleDuLien: string): Promise<void> {
    return;
  }
}
