import { Guide } from './guide';

export interface EntrepotGuideTravail {
  parId(id: string): Promise<Guide | undefined>;
  ajouteDocument(idGuide: string, nomDocument: string, libelleDuLien: string): Promise<void>;
}
