import type { BesoinCyber, Item } from './Catalogue.types';

export enum CollectionGuide {
  LES_ESSENTIELS = 'Les essentiels',
  LES_FONDAMENTAUX = 'Les fondamentaux',
  CRISE_CYBER = 'Crise cyber',
  GESTION_DES_RISQUES_CYBER = 'Gestion des risques cyber',
  SUPERVISION_DE_SECURITE = 'Supervision de sécurité',
  REMEDIATION = 'Remédiation',
  AUTRE = "Autre"
}
export enum Langue {
  FR = 'FR',
  EN = 'EN',
}
export interface Guide extends Item {
  type: 'Guide';
  description: string;
  langue: string;
  collections: CollectionGuide[];
  image: {
    petite: string;
    grande: string;
  } | null;
  documents: { libelle: string; url: string }[];
  datePublication: string;
  dateMiseAJour: string;
  illustration: { petite: string; grande: string };
  thematique: string;
  besoins: BesoinCyber[];
}
