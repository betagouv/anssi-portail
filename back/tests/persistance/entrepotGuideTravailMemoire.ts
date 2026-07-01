import { EntrepotGuideTravail } from '../../src/metier/entrepotGuideTravail.js';
import { DocumentGuide, Guide } from '../../src/metier/guide.js';
import { EntrepotMemoire } from './entrepotMemoire.js';

export class EntrepotGuideTravailMemoire extends EntrepotMemoire<Guide> implements EntrepotGuideTravail {
  async parId(id: string): Promise<Guide | undefined> {
    return this.entites.find((guide) => guide.id === id);
  }

  async sauvegardeDocuments(idGuide: string, documents: DocumentGuide[], nomAnciensDocuments: string[]): Promise<void> {
    const guide = await this.parId(idGuide);
    if (guide) {
      guide.listeDocuments = documents;
      guide.nomsAnciensDocuments = nomAnciensDocuments;
    }
  }
}
