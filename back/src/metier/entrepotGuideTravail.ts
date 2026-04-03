import { DocumentGuide, Guide } from './guide';

export interface EntrepotGuideTravail {
  parId(id: string): Promise<Guide | undefined>;
  sauvegardeDocuments(idGuide: string, documents: DocumentGuide[]): Promise<void>;
}
