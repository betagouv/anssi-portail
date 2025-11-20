import type { Item } from './Catalogue.types';

export enum CollectionGuide {
  LES_ESSENTIELS = 'Les essentiels',
  LES_FONDAMENTAUX = 'Les fondamentaux',
  CRISE_CYBER = 'Crise cyber',
  GESTION_DES_RISQUES_CYBER = 'Gestion des risques cyber',
  SUPERVISION_DE_SECURITE = 'Supervision de sécurité',
  REMEDIATION = 'Remédiation',
}
export enum Langue {
  FR = 'FR',
  EN = 'EN',
}
export interface Guide extends Item {
  type: 'Guide';
  resume: string;
  description: string;
  langue: string;
  collections: string[];
  image: {
    petite: string;
    grande: string;
  };
}
