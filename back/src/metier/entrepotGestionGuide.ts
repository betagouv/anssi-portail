import { Guide } from './guide';

export interface EntrepotGestionGuide {
  parId(id: string): Promise<Guide | undefined>;
  ajouteDocument(idGuide: string, nomDocument: string, libelleDuLien: string): Promise<void>;
}
