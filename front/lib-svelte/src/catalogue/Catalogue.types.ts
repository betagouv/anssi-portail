export type IdItemCyber = string;

export interface Item {
  type: 'ItemCyber' | 'Guide';
  id: string;
  nom: string;
  illustration: string;
}

export interface ItemCyber extends Item {
  type: 'ItemCyber';
  typologie: Typologie;
  description: string;
  lienInterne: string;
  sources?: string[];
  droitsAcces: DroitAcces[];
  format?: FormatRessource;
  lienExterne: string;
}

export interface Guide extends Item {
  type: 'Guide';
  resume: string;
  description: string;
  langue: string;
  collections: string[];
}

export enum BesoinCyber {
  REAGIR = 'REAGIR',
  ETRE_SENSIBILISE = 'ETRE_SENSIBILISE',
  SE_FORMER = 'SE_FORMER',
  SECURISER = 'SECURISER',
  TOUS = 'TOUS',
}

export type RepartitionParBesoin = Record<BesoinCyber, IdItemCyber[]>;

export enum DroitAcces {
  ACCES_LIBRE = 'ACCES_LIBRE',
  ENTITES_PUBLIQUES = 'ENTITES_PUBLIQUES',
  REGULES_NIS2 = 'REGULES_NIS2',
}

export enum Typologie {
  SERVICE = 'service',
  RESSOURCE = 'ressource',
}

export enum FormatRessource {
  PUBLICATION = 'Publication',
  OUTIL = 'Outil',
  LABEL = 'Label',
}

export enum Source {
  ANSSI_TOUTES = 'ANSSI_TOUTES',
  ANSSI = 'ANSSI',
  CERTFR = 'CERT-FR',
  INNOVATION_ANSSI = 'Innovation ANSSI',
  PARTENAIRES = 'Partenaires',
}

export enum Langue {
  FR = 'FR',
  EN = 'EN',
}
