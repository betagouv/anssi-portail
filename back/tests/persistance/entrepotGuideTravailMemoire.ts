import { EntrepotGuideTravail } from '../../src/metier/entrepotGuideTravail';
import { DocumentGuide, Guide } from '../../src/metier/guide';
import { EntrepotMemoire } from './entrepotMemoire';

export class EntrepotGuideTravailMemoire extends EntrepotMemoire<Guide> implements EntrepotGuideTravail {
  async parId(id: string): Promise<Guide | undefined> {
    return this.entites.find((guide) => guide.id === id);
  }

  async sauvegardeDocuments(idGuide: string, documents: DocumentGuide[]): Promise<void> {
    const guide = await this.parId(idGuide);
    if (guide) {
      guide.listeDocuments = documents;
    }
  }
}
